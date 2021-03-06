const $ = require('jquery');
const watcher = require('../../watcher');
const settings = require('../../settings');
const twitch = require('../../utils/twitch');

$('body').on('click', 'a.side-nav-card__link[data-a-target="followed-channel"]', e => {
    const currentTarget = e.currentTarget;
    const router = twitch.getRouter();
    const userLogin = twitch.getSideNavFollowedUserLogin(currentTarget);
    if (!userLogin || !router || !router.history) return;
    const destination = `/${encodeURIComponent(userLogin)}`;
    if (currentTarget.href === destination) return;
    e.preventDefault();
    router.history.push(destination);
});

class HideSidebarElementsModule {
    constructor() {
        settings.add({
            id: 'hideFeaturedChannels',
            name: 'Hide Recommended Channels',
            defaultValue: true,
            description: 'Removes the recommended channels in the sidebar'
        });
        settings.add({
            id: 'autoExpandChannels',
            name: 'Auto Expand Followed Channels List',
            defaultValue: false,
            description: 'Clicks the "Load More" followed channels button in the sidebar for you'
        });
        settings.add({
            id: 'hideRecommendedFriends',
            name: 'Hide Recommended Friends',
            defaultValue: false,
            description: 'Removes the recommended friends section in the sidebar'
        });
        settings.add({
            id: 'hideOfflineFollowedChannels',
            name: 'Hide Offline Followed Channels',
            defaultValue: false,
            description: 'Removes offline followed channels in the sidebar'
        });
        settings.on('changed.hideFeaturedChannels', () => this.toggleFeaturedChannels());
        settings.on('changed.autoExpandChannels', () => this.toggleAutoExpandChannels());
        settings.on('changed.hideRecommendedFriends', () => this.toggleRecommendedFriends());
        settings.on('changed.hideOfflineFollowedChannels', () => this.toggleOfflineFollowedChannels());
        watcher.on('load', () => {
            this.toggleFeaturedChannels();
            this.toggleAutoExpandChannels();
            this.toggleRecommendedFriends();
            this.toggleOfflineFollowedChannels();
        });
    }

    toggleFeaturedChannels() {
        $('body').toggleClass('bttv-hide-featured-channels', settings.get('hideFeaturedChannels'));
    }

    toggleAutoExpandChannels() {
        if (!settings.get('autoExpandChannels')) return;
        $('.side-nav button[data-a-target="side-nav-show-more-button"]').first().trigger('click');
    }

    toggleRecommendedFriends() {
        $('body').toggleClass('bttv-hide-recommended-friends', settings.get('hideRecommendedFriends'));
    }

    toggleOfflineFollowedChannels() {
        $('body').toggleClass('bttv-hide-followed-offline', settings.get('hideOfflineFollowedChannels'));
    }
}

module.exports = new HideSidebarElementsModule();
