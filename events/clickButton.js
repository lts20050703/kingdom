module.exports = {
	async run (bot, button) {
		const { users, kingdoms, general } = bot.db;
		if (button.id.startsWith('delete_kingdom')) {
			await button.clicker.fetch();
			const kingdom_id = button.id.replace('delete_kingdom', '');
			const user_id = button.clicker.user.id;
			const user = await users.get(user_id);
			const kingdom = await kingdoms.get(kingdom_id);
			if (!user || !kingdom || user.role !== 3 || kingdom.owner !== user_id) await button.reply.send('You don\'t have permission to delete this kingdom', true);
			await button.reply.think();
			setTimeout(async function () {
				await button.reply.delete();
				await button.message.edit('Starting kingdom deletion', { components: [] });

				// Delete all members and send them info dm
				for (const member_id of kingdom.members) {
					if (await users.get(`${member_id}.role`) < 3) {
						console.log('sending dm to user: ' + member_id);
						bot.users.cache.get(member_id).send('Hello! This is a message to let you know that <@' + member_id + '> disbanded the kingdom you previously were on. You are no longer in a kingdom. (Your personal stats are unchanged.)');
					}
					await users.delete(member_id);
				}

				// Delete all roles
				const server = bot.guilds.cache.get(button.guild.id);
				const member_role = server.roles.cache.find(r => r.name === kingdom_id + ' ≼🔅Member≽');
				const guard_king_role = server.roles.cache.find(r => r.name === kingdom_id + ' ≪💠Guard/king≫');
				member_role.delete();
				guard_king_role.delete();

				// Delete all channels and category
				const channels = server.channels.cache.filter(channel => channel.parentID === kingdom.category);
				for (const channel of channels) server.channels.cache.get(channel[0]).delete();
				server.channels.cache.find(category => category.id === kingdom.category).delete();

				// Delete the kingdom database
				await kingdoms.delete(kingdom_id);
				const all_kingdoms = await general.get('kingdoms');
				const filtered = all_kingdoms.filter(kingdom => kingdom !== kingdom_id);
				await general.set('kingdoms', filtered);

				// Finishing up
				console.log(`[Bot] Kingdom ${kingdom_id} was deleted.`);
				button.channel.send('<@' + user_id + '> your kingdom was successfully disbanded.').catch(error => console.log(error));
				bot.users.cache.get(user_id).send('<@' + user_id + '> your kingdom was successfully disbanded.').catch(error => console.log(error));
			}, 3000);
		}
	}
};
