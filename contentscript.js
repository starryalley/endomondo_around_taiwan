// total distance of T1+T9 road surrounding Taiwan, got from wiki
var AROUND_TW_DISTANCE = 460.6+476.072;

function xpath(path, node) { return document.evaluate(path, node).iterateNext(); }

function get_distance() {
    var regex = /Total distance/;
    if (regex.test(document.body.innerText)) {
        return xpath('//*[@class="userSummary distance"]/span[@class="quantity"]/span[@class="value"]', document).innerText;
    } 
    // No match was found.
    return "";
}


//add a new HTML <li> element to the page
function add_trip_around_tw(distance) {
    var trips = parseFloat(distance) / AROUND_TW_DISTANCE;
    var ul = $('.userSummary.distance').find('.vars');
    console.log("Calculated trips around TW: " + trips.toFixed(3));

    // create a <li> element
    var elem = $('<li/>', { id: 'trip_around_tw' });
    $(elem).addClass('aroundTW')
        .html('<span class="title">Trips around Taiwan:</span><span class="quantity"><span class="value">' + 
                trips.toFixed(3) + '</span></span><div class="clear"></div>');

    // remove if it already exists
    var current = $('#trip_around_tw');
    if (current.length > 0) 
        current.remove();
    else
        ul.prepend(elem);
}

//event handler for DOM
function DOMModificationHandler(){
    $(this).unbind('DOMSubtreeModified');
    setTimeout(function(){
        var dist = get_distance();
        console.log("reload dist=" + dist);
        add_trip_around_tw(dist);
        $('.innerWidget.personal-best').bind('DOMSubtreeModified',DOMModificationHandler);
    }, 500); //is 500ms safe enough?
}

// main
// update UI first
var dist = get_distance();
console.log("User total distance:" + dist);
add_trip_around_tw(dist);

// set a listener for DOMSubtreeModified event
$('.innerWidget.personal-best').bind('DOMSubtreeModified', DOMModificationHandler);

// notify the background page
chrome.extension.sendRequest({}, function(response) {});

