$(document).ready(function() {
  $('#search-username').on('click', function(event) {
    event.preventDefault();
    var username = $('#username').val();
    var treehouseURL = 'http://teamtreehouse.com/';

    $.ajax({
      url: treehouseURL + username + '.json',
      type: 'GET',
    }).done(function(data) {

      var highEXPlangs = findHighEXPLangs(data.points);
      var completedCourses = findCompletedCourses(data.badges);

      console.log(highEXPlangs);
      console.log(completedCourses);


      if (completedCourses.length === 0 && highEXPlangs.length === 0) {
        // "It looks like you haven't completed any tracks yet. Want to add your work in progress badges instead?"
        // Let the user choose their badge
      } else if (completedCourses.length === 0 && highEXPlangs.length > 1) {
        // We have a many high EXP languages, but haven't completed a track yet.
        // Let the user choose their badge
      } else if (completedCourses.length === 0 && highEXPlangs.length === 1) {
        // We have one high EXP language, but haven't completed a track yet.

      } else if (completedCourses.length > 1) {
        // We've completed multiple tracks.
        // Let the user choose their badge.

      } else { // completedCourses.length === 1
        // We've completed one track.
        var shareURL = buildLinkedInShareURL(completedCourses[0], username);
        displayCourse(completedCourses[0].track, shareURL);
      }

    }).fail(function(data) {
      alertModal('User does not exist', 'Sorry! We coudn\'t find that username on Treehouse. Did your subscription expire, or did you spell the username correctly?');
    });
  });
});

// Get all languages where the user has attained more than 1000 points
function findHighEXPLangs(points) {
  var highEXPlangs = [];

  for (var language in points) {
    if (points[language] > 1000 && language != 'total') {
      highEXPlangs.push(language);
    }
  }

  return highEXPlangs;
}

// Get all the tracks that the user has completed
function findCompletedCourses(badges) {
  var completedCourses = [];
  var availableTracks = {
    "Advanced Sass Concepts" : "Web Design",
    "Combine and Minify Assets" : "Front-End Web Development",
    "Password Resets and Testing" : "Rails Development",
    "Finishing the User Interface" : "Implementing Designs For iPhone",
    "Adding Push Notifications from Parse.com" : "Android Development",
    "Inheritance, Interfaces, and Exceptions" : "PHP Development",
    "Launching and Supporting a WordPress Plugin" : "Wordpress Development",
    "Video Marketing" : "Starting A Business",
    "Finding Good WordPress Plugins and Themes" : "Learn Wordpress",
    "Displaying Our Weather Data" : "iOS Development With Swift",
    "Gettin' CRUD-y With It" : "Learn Python",
    "Blocks Practice" : "Learn Ruby",
    "Efficiency!" : "Learn Java"
  };

  for (var i = 0; i < badges.length; i++) {
    if (badges[i].name in availableTracks) {
      completedCourses.push({
        'track' : availableTracks[badges[i].name],
        'badge' : badges[i]
      });
    }
  }

  return completedCourses;
}

// Builds the share URL required for LinkedIn
function buildLinkedInShareURL(course, username) {
  var track = course.track;
  var badge = course.badge;

  var url = 'https://www.linkedin.com/profile/add?_ed=0_7nTFLiuDkkQkdELSpruCwI3eGOWS9kTguPfeqlj5kgb0SLpi97XL5H3ygTHZ0a1-aSgvthvZk7wTBMS3S-m0L6A6mLjErM6PJiwMkk6nYZylU7__75hCVwJdOTZCAkdv';
  url += '&pfCertificationName=' + encodeURIComponent(track);
  url += '&pfCertificationUrl=' + encodeURIComponent('http://teamtreehouse.com/' + username);
  url += '&pfCertStartDate=' +
  (function(date){
    return date.getFullYear() + date.getMonth().pad(2);
  })(new Date(badge.earned_date));

  return url;
}

// Display an error message to the user in a modal
function alertModal(title, body) {
  $('#alert-modal-title').html(title);
  $('#alert-modal-body').html(body);
  $('#alert-modal').modal('show');
}

// Pads an integer with the specified number of leading zeroes
Number.prototype.pad = function(digits) {
  var s = String(this);
  while (s.length < (digits || 0)) {
    s = '0' + s;
  }

  return s;
};

