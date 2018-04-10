// Cribbed from https://github.com/nydailynews/mets-misery-index/blob/master/www/js/app.js

// INJURY TRACKER
// First init fires, then on_load.
var injuries = {
    config: {
    },
    update_config: function(config) {
        // Take an external config object and update this config object.
        for ( var key in config )
        {
            if ( config.hasOwnProperty(key) )
            {
                this.config[key] = config[key];
            }
        }
    },
    build_table: function(data) {
        // Take records in the data array and add them to a table.
        var l = data.length;
        var t = document.querySelector('#injury tbody');
        for ( var i = 0; i < l; i ++ ) {
            // Put together the text and the markup we need to populate a table row.
            var injury = data[i]['injury'];
            if ( data[i]['url'] !== '' ) injury = '<a target="_blank" href="' + data[i]['url'].trim() + '">' + data[i]['injury'] + '</a>';
            var start_date = utils.ap_date(data[i]['dl-start-date']);
            if ( data[i]['dl-start-date'].trim().toLowerCase() == 'shruggie' ) start_date = '¯\\_(ツ)_/¯';

            var dl_status = data[i]['dl-status'];
            if ( dl_status.trim().toLowerCase() == 'shruggie' ) dl_status = '¯\\_(ツ)_/¯';

            var tr = document.createElement('tr');
            if ( data[i]['dl-stint-ended'].trim() !== '' ) tr.setAttribute('class', 'inactive');
            var markup = '\n\
                        <td>' + data[i]['player-name'] + '</td>\n\
                        <td>' + data[i]['player-position'] + '</td>\n\
                        <td>' + injury + '</td>\n\
                        <td>' + dl_status + '</td>\n\
                        <td>' + start_date + '</td>\n\
                        ';
            tr.innerHTML = markup;
            t.appendChild(tr);
        }
    },
    on_load: function() {
        if ( !! document.getElementById('injury') ) injuries.build_table(injuries.data);
    },
    init: function(year) {
        if ( year == null ) year = 2018;
        // get_json takes three params: filepath, the object that's calling it, and a callback.
        utils.get_json('output/yankees-injured-list-' + year + '.json?' + utils.rando(), injuries, injuries.on_load);
    }
}

// UTILS
var utils = {
    ap_numerals: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'],
    months: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
    ap_months: ['Jan.', 'Feb.', 'March', 'April', 'May', 'June', 'July', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'],
    ap_date: function(date) {
        // Given a date such as "2018-02-03" return an AP style date.
        var this_year = new Date().getFullYear();
        var parts = date.split('-')
        var day = +parts[2];
        var month = this.ap_months[+parts[1] - 1];
        if ( this_year == +parts[0] ) return month + ' ' + day;
        return month + ' ' + day + ', ' + parts[0];
    },
    rando: function() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for ( var i=0; i < 8; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    },
    add_zero: function(i) {
        // For values less than 10, return a zero-prefixed version of that value.
        if ( +i < 10 ) return "0" + i;
        return i;
    },
    parse_date_str: function(date) {
        // date is a datetime-looking string such as "2017-07-25"
        // Returns a date object.
        if ( typeof date !== 'string' ) return Date.now();

        var date_bits = date.split(' ')[0].split('-');

        // We do that "+date_bits[1] - 1" because months are zero-indexed.
        var d = new Date(date_bits[0], +date_bits[1] - 1, date_bits[2], 0, 0, 0);
        return d;
    },
    parse_date: function(date) {
        // date is a datetime-looking string such as "2017-07-25"
        // Returns a unixtime integer.
        var d = this.parse_date_str(date);
        return d.getTime();
    },
    days_between: function(from, to) {
        // Get the number of days between two dates. Returns an integer. If to is left blank, defaults to today.
        // Both from and to should be strings 'YYYY-MM-DD'.
        // Cribbed from https://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
        if ( to == null ) to = new Date();
        else to = this.parse_date_str(to);
        from = this.parse_date_str(from);
        var days_diff = Math.floor((from-to)/(1000*60*60*24));
        return days_diff;
    },
    get_json: function(path, obj, callback) {
        // Downloads local json and returns it.
        // Cribbed from http://youmightnotneedjquery.com/
        var request = new XMLHttpRequest();
        request.open('GET', path, true);

        request.onload = function() {
            if ( request.status >= 200 && request.status < 400 ) {
                obj.data = JSON.parse(request.responseText);
                callback();
            }
            else {
                console.error('DID NOT LOAD ' + path + request);
                return false;
            }
        };
        request.onerror = function() {};
        request.send();
    },
    add_class: function(el, class_name) {
        // From http://youmightnotneedjquery.com/#add_class
        if ( el.classlist ) el.classList.add(class_name);
        else el.className += ' ' + class_name;
        return el;
    },
    add_js: function(src, callback) {
        var s = document.createElement('script');
        if ( typeof callback === 'function' ) s.onload = function() { callback(); }
        //else console.log("Callback function", callback, " is not a function");
        s.setAttribute('src', src);
        document.getElementsByTagName('head')[0].appendChild(s);
    },
}


