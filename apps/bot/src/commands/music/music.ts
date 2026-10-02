import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { Command } from '../../types.js';
import { musicService, LoopMode } from '../../services/MusicService.js';
import { createEmbed, createErrorEmbed, createSuccessEmbed } from '@null-bot/shared';

export const musicCommand: Command = {
  name: 'music',
  description: 'Music player system controls',
  category: 'Music',
  userPermissions: [],
  botPermissions: [],
  data: new SlashCommandBuilder()
    .setName('music')
    .setDescription('Music player commands')
    .addSubcommand((sub) =>
      sub
        .setName('play')
        .setDescription('Play a song or add to queue')
        .addStringOption((opt) => opt.setName('query').setDescription('Song title or URL').setRequired(true))
    )
    .addSubcommand((sub) => sub.setName('pause').setDescription('Pause current playback'))
    .addSubcommand((sub) => sub.setName('resume').setDescription('Resume playback'))
    .addSubcommand((sub) => sub.setName('skip').setDescription('Skip current song'))
    .addSubcommand((sub) => sub.setName('stop').setDescription('Stop music and clear queue'))
    .addSubcommand((sub) => sub.setName('queue').setDescription('View music queue'))
    .addSubcommand((sub) => sub.setName('nowplaying').setDescription('View currently playing song'))
    .addSubcommand((sub) =>
      sub
        .setName('volume')
        .setDescription('Set playback volume')
        .addIntegerOption((opt) => opt.setName('percent').setDescription('Volume (0-100)').setMinValue(0).setMaxValue(100).setRequired(true))
    )
    .addSubcommand((sub) => sub.setName('shuffle').setDescription('Shuffle the queue'))
    .addSubcommand((sub) =>
      sub
        .setName('loop')
        .setDescription('Set loop mode')
        .addStringOption((opt) =>
          opt
            .setName('mode')
            .setDescription('Loop mode')
            .setRequired(true)
            .addChoices(
              { name: 'Off', value: 'OFF' },
              { name: 'Track', value: 'TRACK' },
              { name: 'Queue', value: 'QUEUE' }
            )
        )
    )
    .addSubcommand((sub) => sub.setName('clearqueue').setDescription('Clear all songs in queue'))
    .addSubcommand((sub) => sub.setName('leave').setDescription('Disconnect bot from voice channel')),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild!;
    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;

    if (['play', 'join'].includes(subcommand) && !voiceChannel) {
      await interaction.reply({ embeds: [createErrorEmbed('You must be in a voice channel to use music commands.')], ephemeral: true });
      return;
    }

    const player = musicService.getPlayer(guild.id);

    if (subcommand === 'play') {
      const query = interaction.options.getString('query', true);
      if (voiceChannel && !player.connection) {
        player.join(voiceChannel, interaction.channel as any);
      }

      const track = {
        title: query,
        url: query.startsWith('http') ? query : `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
        duration: '3:45',
        requestedBy: interaction.user.tag,
      };

      player.addTrack(track);
      await interaction.reply({ embeds: [createSuccessEmbed(`Added **${track.title}** to the queue.`)] });
      return;
    }

    if (subcommand === 'pause') {
      player.player.pause();
      player.isPaused = true;
      await interaction.reply({ embeds: [createSuccessEmbed('Paused music playback.')] });
      return;
    }

    if (subcommand === 'resume') {
      player.player.unpause();
      player.isPaused = false;
      await interaction.reply({ embeds: [createSuccessEmbed('Resumed music playback.')] });
      return;
    }

    if (subcommand === 'skip') {
      player.playNext();
      await interaction.reply({ embeds: [createSuccessEmbed('Skipped to the next song.')] });
      return;
    }

    if (subcommand === 'stop') {
      player.stop();
      await interaction.reply({ embeds: [createSuccessEmbed('Stopped playback and cleared the queue.')] });
      return;
    }

    if (subcommand === 'queue') {
      if (player.queue.length === 0 && !player.currentTrack) {
        await interaction.reply({ embeds: [createSuccessEmbed('Music queue is currently empty.')] });
        return;
      }

      const current = player.currentTrack ? `**Now Playing:** [${player.currentTrack.title}](${player.currentTrack.url})\n\n` : '';
      const queueList = player.queue.slice(0, 10).map((t, idx) => `\`${idx + 1}.\` [${t.title}](${t.url}) — Requested by ${t.requestedBy}`).join('\n');

      await interaction.reply({
        embeds: [createEmbed({ title: '🎶 Music Queue', description: `${current}**Up Next:**\n${queueList || 'No more songs in queue.'}` })],
      });
      return;
    }

    if (subcommand === 'nowplaying') {
      if (!player.currentTrack) {
        await interaction.reply({ embeds: [createErrorEmbed('No song is currently playing.')], ephemeral: true });
        return;
      }
      await interaction.reply({
        embeds: [
          createEmbed({
            title: '🎵 Now Playing',
            description: `[${player.currentTrack.title}](${player.currentTrack.url})\n**Requested By:** ${player.currentTrack.requestedBy}\n**Loop Mode:** ${player.loopMode}\n**Volume:** ${player.volume}%`,
          }),
        ],
      });
      return;
    }

    if (subcommand === 'volume') {
      const percent = interaction.options.getInteger('percent', true);
      player.volume = percent;
      await interaction.reply({ embeds: [createSuccessEmbed(`Set music volume to **${percent}%**.`)] });
      return;
    }

    if (subcommand === 'shuffle') {
      player.shuffle();
      await interaction.reply({ embeds: [createSuccessEmbed('Shuffled the queue songs!')] });
      return;
    }

    if (subcommand === 'loop') {
      const mode = interaction.options.getString('mode', true) as LoopMode;
      player.loopMode = mode;
      await interaction.reply({ embeds: [createSuccessEmbed(`Set loop mode to **${mode}**.`)] });
      return;
    }

    if (subcommand === 'clearqueue') {
      player.queue = [];
      await interaction.reply({ embeds: [createSuccessEmbed('Cleared all songs in queue.')] });
      return;
    }

    if (subcommand === 'leave') {
      musicService.destroyPlayer(guild.id);
      await interaction.reply({ embeds: [createSuccessEmbed('Disconnected from voice channel.')] });
    }
  },
};
