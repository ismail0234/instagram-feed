var instagram = {

    profile: new Array(),
    result: new Array(),
    cache: new Object(),
    sizes: new Object(),
    profileCount: 0,
    timer: 0,
    requestCount: 0,
    limit: 0,
    containerId: '#instagram-container',
    itemId: '.instagram-item',
    urlId: '.instagram-url',
    imageId: '.instagram-image',
    QUERY_HASH: '58b6785bea111c67129decbe6a448951',

    saveCache: function() {
        localStorage.setItem("instagram", JSON.stringify(this.cache));
    },

    getCache: function() {
        var cache = localStorage.getItem("instagram");
        if (cache == null) {
            this.saveCache();
            return this.getCache();
        }

        return JSON.parse(cache);
    },

    addProfile: function(username, userId) {
        this.cache = this.getCache();

        this.profileCount++;
        if (typeof this.cache[username] != "undefined") {
            instagram.addProfileId(username, this.cache[username]);
            return true;
        }

        if (typeof userId != "undefined" && userId > 0) {
            instagram.addProfileId(username, userId);
        } else {
            $.get(this.getSearchUrl(username), function(response) {
                for (var index in response.users) {
                    if (response.users[index].user.username == username) {
                        instagram.addProfileId(username, response.users[index].user.pk);
                        break;
                    }
                }
            });
        }


        return true;
    },

    addProfileId: function(username, userId) {
        this.profile.push(userId);
        this.cache[username] = userId;
        if (this.profile.length == this.profileCount) {
            this.saveCache();
        }
    },

    checkFinish: function() {
        return this.requestCount == this.profile.length;
    },

    sort: function(medias) {
        return medias.sort(function(a, b) {
            if (a.time > b.time) {
                return -1;
            }
            return 1;
        });
    },

    OnFinish: function() {
        var container = $(instagram.containerId);
        if (container.length <= 0) {
            return false;
        }

        var items = container.find(instagram.itemId);
        if (items.length <= 0) {
            return false;
        }

        var response = this.sort(instagram.result);
        for (var i = 0; i < items.length; i++) {
            if (typeof items[i] == "undefined") {
                return false;
            }

            if (typeof response[i] == "undefined") {
                return false;
            }

            var size = $(items[i]).find(instagram.imageId).data('size');
            if (typeof size == "undefined") {
                size = 'medium';
            }

            $(items[i]).find(instagram.urlId).attr('href', response[i].url);
            $(items[i]).find(instagram.imageId).attr('src', response[i].image[this.sizes[size]].src);
        }
    },

    getSearchUrl(username) {
        return 'https://www.instagram.com/web/search/topsearch/?query=' + username;
    },

    getProfile: function(userId) {
        return 'https://www.instagram.com/graphql/query/?query_hash=' + this.QUERY_HASH + '&variables={"id"%3A"' + userId + '"%2C"first"%3A' + this.limit + '}';
    },

    getImage: function(response, index) {
        return response.data.user.edge_owner_to_timeline_media.edges[index].node.thumbnail_resources;
    },

    getUrl: function(response, index) {
        return 'https://www.instagram.com/p/' + response.data.user.edge_owner_to_timeline_media.edges[index].node.shortcode + '/';
    },

    getTimestamp: function(response, index) {
        return response.data.user.edge_owner_to_timeline_media.edges[index].node.taken_at_timestamp;
    },

    load: function() {

        this.sizes = new Object();
        this.sizes.thumbnail = 0;
        this.sizes.small = 1;
        this.sizes.medium = 2;
        this.sizes.large = 3;
        this.sizes.xlarge = 4;

        this.limit = $(this.containerId).find(this.itemId).length;
        if (this.timer > 0) {
            clearInterval(this.timer);
        }

        this.requestCount = 0;
        this.result = new Array();
        this.timer = setInterval(this.loadCore, 100);
    },

    loadCore: function() {
        if (instagram.profile.length != instagram.profileCount) {
            return false;
        }

        clearInterval(instagram.timer);

        for (var i = 0; i < instagram.profile.length; i++) {
            $.get(instagram.getProfile(instagram.profile[i]), function(response) {

                instagram.requestCount++;
                if (typeof response.data.user.edge_owner_to_timeline_media.edges == "undefined") {
                    if (instagram.checkFinish()) {
                        instagram.OnFinish();
                    }
                    return false;
                }

                for (var index in response.data.user.edge_owner_to_timeline_media.edges) {
                    var media = new Object();
                    media.url = instagram.getUrl(response, index);
                    media.image = instagram.getImage(response, index);
                    media.time = instagram.getTimestamp(response, index);

                    instagram.result.push(media);
                }

                if (instagram.checkFinish()) {
                    instagram.OnFinish();
                }
            });
        }

        return true;
    }
};
