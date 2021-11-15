let request = require('request');
var tinycolor = require("tinycolor2");
require('dotenv').config()

const key = process.env.CANVAS_KEY;

window.onload = function() {
    console.log(window.localStorage.getItem('preload'));
}

function getLetterGrade(score) {
  if (score >= 90) {
    return 'A';
  } else if (score >= 80) {
    return 'B';
  } else if (score >= 70) {
    return 'C';
  } else if (score >= 60) {
    return 'D';
  } else {
    return 'F';
  }
}
function softenColor(color) {
    return color.replace('1', '0.9').replace('2', '0.8').replace('3', '0.7').replace('4', '0.6').replace('5', '0.5').replace('6', '0.4').replace('7', '0.3').replace('8', '0.2').replace('9', '0.1');
}

function gcontains(grades, tc) {
  for (var i = 0; i < grades.length; i++) {
    if (grades[i].course_id == tc) {
        return true;
    }
  }
  return false;
}

function loadAssignment(courseid) {
    console.log('Loading assignment for ' + courseid);
}

function getGradeFor(grades, id) {
    for (var i = 0; i < grades.length; i++) {
        if (grades[i].course_id == id) {
            return grades[i].grades;
        }
    }
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function fade(element) {
    var op = 1;  // initial opacity
    var timer = setInterval(function () {
        if (op <= 0.1){
            clearInterval(timer);
            element.style.display = 'none';
        }
        element.style.opacity = op;
        element.style.filter = 'alpha(opacity=' + op * 100 + ")";
        op -= op * 0.1;
    }, 10);
}

window.addEventListener('DOMContentLoaded', () => {
    document.body.style.overflow = 'hidden';
    const coursec = document.getElementById('course');
    const course_holder = document.getElementById('course_holder');
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }

    var s_courses = [];
    var s_courses_ids = [];
    request({method: 'get', baseUrl: "https://issaquah.instructure.com/api/v1/", uri: "/users/self/colors", headers: {'Authorization': 'Bearer '+key}}, function(error, response, body) {
        if (error) {
            console.log(error);
        } else {
            if(response.statusCode == 200) {
            const colors = JSON.parse(body).custom_colors;
            request({method: 'get', baseUrl: "https://issaquah.instructure.com/api/v1/", uri: "/dashboard/dashboard_cards", headers: {'Authorization': 'Bearer '+key}}, function(error, response, mbody) {
                if (error) {
                    console.log(error);
                } else {
                    if(response.statusCode == 200) {
                         const courses = JSON.parse(mbody);
                        console.log(courses);
                courses.forEach(course => {
                    s_courses.push(course.shortName);
                    s_courses_ids.push(course.id);
                });
                request({ method: 'get', baseUrl: "https://issaquah.instructure.com/api/v1/", uri: "/users/self/enrollments", headers: { 'Authorization': 'Bearer '+key } }, function (error, response, body) {
                    if (error) {
                        console.log(error);
                    } else {
                        if (response.statusCode == 200) {
                            const grades = JSON.parse(body);
                            s_courses.forEach(coursenme => {
                                if (gcontains(grades, s_courses_ids[s_courses.indexOf(coursenme)])) {
                                    var course_empty = coursec.content.cloneNode(true);
                                    var course_name = coursenme;
                                    var course_id = s_courses_ids[s_courses.indexOf(coursenme)];
                                    //course_empty.dataset.courseid = course_id;
                                    var c_grade = getGradeFor(grades, course_id);
                                    var course_color = "rgb(0,0,0)"
                                    if(colors["course_"+course_id] != undefined) {
                                        course_color = tinycolor(colors["course_"+course_id]).lighten().desaturate(50).toRgbString();
                                    }
                                    course_empty.querySelector('p').innerHTML = course_name;
                                    course_empty.querySelector('p').style.color = course_color;
                                    if (c_grade.current_grade != null) {
                                        course_empty.querySelectorAll('p').item(1).innerHTML = c_grade.current_grade + '     <i><font size="-4">' + c_grade.current_score + "%</font></i>";
                                    } else if (c_grade.current_score != null) {
                                        course_empty.querySelectorAll('p').item(1).innerHTML = getLetterGrade(c_grade.current_score) + '     <i><font size="-4">' + c_grade.current_score + "%</font></i>";
                                    } else {
                                        course_empty.querySelectorAll('p').item(1).innerHTML = "No Grade";
                                    }
                                    course_holder.appendChild(course_empty);
                                }
                            });
                            var children = course_holder.children;
                            for (var i = 0; i < children.length; i++) {
                                var courseelement = children[i];
                                console.log(courseelement.dataset.courseid);
                                courseelement.addEventListener('click', () => {
                                    loadAssignment(courseelement.dataset.courseid);
                                });
                            }
                        }
                    }
                });
            }
        }
    });
        }
    }
    
});

    
    /*
    request({method: 'get', baseUrl: "https://issaquah.instructure.com/api/v1/", uri: "/users/self/enrollments", headers: {'Authorization': 'Bearer 7611~d12fVHlQMxOgq0PKl3fM1VZawBzURngdbi1V5BbEbPHR57JemsHwCljn4KDEtsl6'}}, function(error, response, body) {
        if(error) {
            console.log(error);
        } else {

        }
    });
    */

    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    document.getElementById('updated').innerHTML = "Last Updated at "+dateTime+" - Copyright Grades Pro 2021";

    wait(2000).then(() => {
        fade(document.getElementById('loader'))
        document.body.style.overflow = 'scroll';
        document.body.style.overflowX = 'none';
    })
    
    //

})

/*
request({method: 'get', baseUrl: "https://issaquah.instructure.com/api/v1/", uri: "/users/self/enrollments", headers: {'Authorization': 'Bearer 7611~d12fVHlQMxOgq0PKl3fM1VZawBzURngdbi1V5BbEbPHR57JemsHwCljn4KDEtsl6'}}, function(error, response, body) {
        if(error) {
            console.log(error);
        } else {
            console.log(response.statusCode, body);
            if(response.statusCode == 200) {
                const grades = JSON.parse(body);
                grades.forEach(grade => {
                    if(s_courses_ids.includes(grade.course_id)) {
                        var course_empty = coursec.content.cloneNode(true);
                        var course_name = s_courses[s_courses_ids.indexOf(grade.course_id)];
                        course_empty.querySelector('p').innerHTML = course_name;
                        if(grade.grades.current_grade != null) {
                            course_empty.querySelectorAll('p').item(1).innerHTML = grade.grades.current_grade+'     <i><font size="-4">'+grade.grades.current_score+"%</font></i>";
                        } else if(grade.grades.current_score != null) {
                            course_empty.querySelectorAll('p').item(1).innerHTML = getLetterGrade(grade.grades.current_score)+'     <i><font size="-4">'+grade.grades.current_score+"%</font></i>";
                        } else {
                            course_empty.querySelectorAll('p').item(1).innerHTML = "No Grade";
                        }
                        course_holder.appendChild(course_empty);
                    }
                });
                */