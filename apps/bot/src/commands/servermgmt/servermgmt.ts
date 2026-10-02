import { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction } from 'discord.js';
import { Command } from '../../types.js';
import { BackupService } from '../../services/BackupService.js';
import { createErrorEmbed, createSuccessEmbed } from '@null-bot/shared';

export const serverMgmtCommand: Command = {
  name: 'servermgmt',
  description: 'Manage server backup, restore, and channel setups',
  category: 'ServerManagement',
  userPermissions: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.Administrator],
  data: new SlashCommandBuilder()
    .setName('servermgmt')
    .setDescription('Server management utilities')
    .addSubcommand((sub) =>
      sub
        .setName('backup')
        .setDescription('Create a backup of server roles and channels')
        .addStringOption((opt) => opt.setName('name').setDescription('Backup title').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub
        .setName('restore')
        .setDescription('Restore server roles and channels from a backup')
        .addStringOption((opt) => opt.setName('backup_id').setDescription('Backup ID').setRequired(true))
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild!;

    if (subcommand === 'backup') {
      const name = interaction.options.getString('name', true);
      const backupId = await BackupService.createBackup(guild, interaction.user.id, name);
      await interaction.reply({
        embeds: [createSuccessEmbed(`Created server backup! Backup ID: \`${backupId}\``)],
      });
      return;
    }

    if (subcommand === 'restore') {
      const backupId = interaction.options.getString('backup_id', true);
      try {
        await BackupService.restoreBackup(guild, backupId);
        await interaction.reply({
          embeds: [createSuccessEmbed(`Restored missing roles and channels from backup \`${backupId}\`.`)],
        });
      } catch (err: any) {
        await interaction.reply({ embeds: [createErrorEmbed(err.message)], ephemeral: true });
      }
    }
  },
};
