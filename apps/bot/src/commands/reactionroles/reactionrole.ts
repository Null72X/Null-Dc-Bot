import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  TextChannel,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} from 'discord.js';
import { Command } from '../../types.js';
import { ReactionRolePanelModel } from '@null-bot/database';
import { createEmbed, createSuccessEmbed } from '@null-bot/shared';
import crypto from 'crypto';

export const reactionRoleCommand: Command = {
  name: 'reactionrole',
  description: 'Create interactive button or select menu role panel',
  category: 'ReactionRoles',
  userPermissions: [PermissionFlagsBits.ManageRoles],
  botPermissions: [PermissionFlagsBits.ManageRoles],
  data: new SlashCommandBuilder()
    .setName('reactionrole')
    .setDescription('Create interactive role assignment panel')
    .addStringOption((opt) => opt.setName('title').setDescription('Panel title').setRequired(true))
    .addStringOption((opt) => opt.setName('description').setDescription('Panel description').setRequired(true))
    .addRoleOption((opt) => opt.setName('role1').setDescription('First role option').setRequired(true))
    .addRoleOption((opt) => opt.setName('role2').setDescription('Second role option').setRequired(false))
    .addRoleOption((opt) => opt.setName('role3').setDescription('Third role option').setRequired(false))
    .addStringOption((opt) =>
      opt
        .setName('style')
        .setDescription('Panel display style')
        .setRequired(false)
        .addChoices(
          { name: 'Buttons', value: 'BUTTONS' },
          { name: 'Dropdown Select', value: 'SELECT' }
        )
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    const title = interaction.options.getString('title', true);
    const description = interaction.options.getString('description', true);
    const style = (interaction.options.getString('style') || 'BUTTONS') as 'BUTTONS' | 'SELECT';

    const role1 = interaction.options.getRole('role1', true);
    const role2 = interaction.options.getRole('role2');
    const role3 = interaction.options.getRole('role3');

    const roles = [role1, role2, role3].filter((r): r is NonNullable<typeof r> => r !== null);
    const guild = interaction.guild!;
    const channel = interaction.channel as TextChannel;
    const panelId = `rr_${crypto.randomBytes(4).toString('hex')}`;

    const embed = createEmbed({
      title: `🎭 ${title}`,
      description: `${description}\n\n**Available Roles:**\n${roles.map((r) => `• <@&${r.id}>`).join('\n')}`,
      color: '#5865F2',
    });

    const components: ActionRowBuilder<ButtonBuilder | StringSelectMenuBuilder>[] = [];

    if (style === 'BUTTONS') {
      const row = new ActionRowBuilder<ButtonBuilder>();
      roles.forEach((r) => {
        row.addComponents(
          new ButtonBuilder()
            .setCustomId(`rr_toggle:${panelId}:${r.id}`)
            .setLabel(r.name)
            .setStyle(ButtonStyle.Secondary)
        );
      });
      components.push(row);
    } else {
      const menu = new StringSelectMenuBuilder()
        .setCustomId(`rr_select:${panelId}`)
        .setPlaceholder('Select roles to toggle...')
        .setMinValues(0)
        .setMaxValues(roles.length)
        .addOptions(
          roles.map((r) => ({
            label: r.name,
            value: r.id,
            description: `Toggle role @${r.name}`,
          }))
        );
      components.push(new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu));
    }

    const message = await channel.send({ embeds: [embed], components });

    await ReactionRolePanelModel.create({
      guildId: guild.id,
      panelId,
      channelId: channel.id,
      messageId: message.id,
      title,
      description,
      mode: 'MULTI',
      style,
      options: roles.map((r) => ({ label: r.name, roleId: r.id })),
    });

    await interaction.reply({ embeds: [createSuccessEmbed('Reaction role panel created!')], ephemeral: true });
  },
};
