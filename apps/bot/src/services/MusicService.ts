import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
  entersState,
} from '@discordjs/voice';
import { Guild, VoiceBasedChannel, TextBasedChannel } from 'discord.js';
import { createScopedLogger } from '@null-bot/logger';
import { createEmbed } from '@null-bot/shared';

const logger = createScopedLogger('MusicService');

export interface Track {
  title: string;
  url: string;
  duration: string;
  requestedBy: string;
}

export type LoopMode = 'OFF' | 'TRACK' | 'QUEUE';

export class GuildMusicPlayer {
  public guildId: string;
  public connection: VoiceConnection | null = null;
  public player: AudioPlayer;
  public queue: Track[] = [];
  public currentTrack: Track | null = null;
  public textChannel: TextBasedChannel | null = null;
  public volume = 100;
  public loopMode: LoopMode = 'OFF';
  public isPaused = false;

  constructor(guildId: string) {
    this.guildId = guildId;
    this.player = createAudioPlayer();

    this.player.on(AudioPlayerStatus.Idle, () => {
      this.handleSongEnd();
    });

    this.player.on('error', (err) => {
      logger.error(`Music player error in guild ${guildId}:`, { error: err });
      this.handleSongEnd();
    });
  }

  public join(voiceChannel: VoiceBasedChannel, textChannel?: TextBasedChannel): VoiceConnection {
    this.textChannel = textChannel || null;
    this.connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: this.guildId,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator as any,
    });

    this.connection.subscribe(this.player);
    return this.connection;
  }

  public addTrack(track: Track): void {
    this.queue.push(track);
    if (!this.currentTrack && !this.isPaused) {
      this.playNext();
    }
  }

  public playNext(): void {
    if (this.queue.length === 0) {
      this.currentTrack = null;
      if (this.textChannel && 'send' in this.textChannel) {
        (this.textChannel as any).send({
          embeds: [createEmbed({ title: '🎶 Music Queue Ended', description: 'No more songs in the queue.' })],
        }).catch(() => {});
      }
      return;
    }

    if (this.loopMode === 'TRACK' && this.currentTrack) {
      // Re-play current track
    } else {
      if (this.loopMode === 'QUEUE' && this.currentTrack) {
        this.queue.push(this.currentTrack);
      }
      this.currentTrack = this.queue.shift() || null;
    }

    if (!this.currentTrack) return;

    // Standard audio resource handling (placeholder/stream)
    const resource = createAudioResource(this.currentTrack.url, {
      inlineVolume: true,
    });
    if (resource.volume) {
      resource.volume.setVolume(this.volume / 100);
    }

    this.player.play(resource);

    if (this.textChannel && 'send' in this.textChannel) {
      (this.textChannel as any).send({
        embeds: [
          createEmbed({
            title: '🎵 Now Playing',
            description: `[${this.currentTrack.title}](${this.currentTrack.url})\n**Requested by:** ${this.currentTrack.requestedBy}`,
            color: '#5865F2',
          }),
        ],
      }).catch(() => {});
    }
  }

  private handleSongEnd(): void {
    this.playNext();
  }

  public stop(): void {
    this.queue = [];
    this.currentTrack = null;
    this.player.stop();
    if (this.connection) {
      this.connection.destroy();
      this.connection = null;
    }
  }

  public shuffle(): void {
    for (let i = this.queue.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.queue[i], this.queue[j]] = [this.queue[j], this.queue[i]];
    }
  }
}

class MusicServiceManager {
  private players = new Map<string, GuildMusicPlayer>();

  public getPlayer(guildId: string): GuildMusicPlayer {
    let p = this.players.get(guildId);
    if (!p) {
      p = new GuildMusicPlayer(guildId);
      this.players.set(guildId, p);
    }
    return p;
  }

  public destroyPlayer(guildId: string): void {
    const p = this.players.get(guildId);
    if (p) {
      p.stop();
      this.players.delete(guildId);
    }
  }
}

export const musicService = new MusicServiceManager();
