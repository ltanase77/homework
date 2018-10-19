'use strict';

$(document).ready(function() {

    let classes = {
        Luni: ["Engleză", "Desen", "Matematică", "Limba Română", "Opțional", "Dirigenție"],
        Marti: ["Tehnologie", "Engleză",  "Română", "Istorie", "Franceză", "Liber"],
        Miercuri: ["Limba Română", "TIC", "Matematică", "Geografie", "Educație Fizică", "Muzică"],
        Joi: ["Matematică", "Religie", "Opțional", "Biologie", "Educație Civică", "Istorie"],
        Vineri: ["Limba Română", "Franceză", "Educație Fizică", "Matematică", "Engleză", "Liber"]
    };

    let homeworks = {
        Luni: [],
        Marti: [],
        Miercuri: [],
        Joi: [],
        Vineri: []
    };

    if(window.localStorage) {
        if (!localStorage.getItem('Materii')) {
            localStorage.setItem("Materii", JSON.stringify(classes));
            console.log("Stocare materii initiale");
        }

        if (!localStorage.getItem('Teme')) {
            localStorage.setItem('Teme', JSON.stringify(homeworks));
            console.log("Stocare teme initiale");
        }
    }


    let model = {
        getAllSubjects: function() {
            return JSON.parse(localStorage.getItem("Materii"));
        },

        getDaySubjects: function(day) {
            let daySubjects = this.getAllSubjects();
            return daySubjects[day];
        },

        setSubject: function(day, subject, newSubj) {
            let daySubjects = this.getDaySubjects(day);
            //console.log(daySubjects);
            daySubjects.forEach((elem) => {
                if (elem === subject) {
                   let index = daySubjects.indexOf(elem);
                   daySubjects[index] = newSubj;
                }
            });
            classes[day] = daySubjects;
            localStorage.setItem('Materii', JSON.stringify(classes));
        },

        getAllHomeworks: function() {
            return JSON.parse(localStorage.getItem("Teme"));
        },


        setHomework: function(day, subject, content) {
            let homeworks = this.getAllHomeworks();
            console.log(homeworks[day].length);
            if (homeworks[day].length === 0) {
                homeworks[day].push({subject: subject, content: content});
                console.log ('primul element');
            }
            else {
                for (let i = 0; i < homeworks[day].length; i++) {
                    if (homeworks[day][i].subject === subject) {
                        if (homeworks[day][i].content !== content) {
                            homeworks[day][i].content = content;
                            console.log('schimba doar continutul');
                        }
                    } else {
                        var check = homeworks[day].length - 1;
                        check += 1;
                        console.log(check);
                    }
                }

                if (check === homeworks[day].length) {
                    homeworks[day].push({subject: subject, content: content});
                    console.log ('un nou element');
                }
            }
            localStorage.setItem('Teme', JSON.stringify(homeworks));
        }
    };

    let controller = {
        init: function() {
            //$('tr').sortable();
            let initialValue;
            $('.icon-edit').on('click', function() {
                let elem = $(this).prev();
                initialValue = elem.text();
                //console.log(elem);
                elem.attr('contenteditable', true);
                elem.css('borderBottom', '1px solid blue');
            });

           $('.icon-save').on('click', function() {
                let elem = $(this).prev().prev();
                let changedValue = elem.text();
                let day = elem.attr('class');
                day = day[0].toUpperCase() + day.slice(1).toLowerCase();
                //console.log(day);
                model.setSubject(day, initialValue, changedValue);
                elem.text(changedValue);
                elem.attr('contenteditable', false);
                elem.css('borderBottom', 'none');
           });

           $('.homework-edit').on('click', function() {
                let elem = $(this).next().next();
                elem.attr('contenteditable', true);
           });

           $('.homework-save').on('click', function() {
               let elem = $(this).next();
               let content = elem.text();
               let day = elem.parent().attr('id');
               day = day.substr(0, day.length - 2);
               day = day[0].toUpperCase() + day.slice(1).toLowerCase();
               console.log(day);
               let subject = $(this).parent().prev().prev().children().first().text();
               subject.trim();
               console.log(subject);
               model.setHomework(day, subject, content);
               elem.attr('contenteditable', false);
           });

           view.displaySubjects();
           view.displayHomeworks();
        },

    };

    let view = {
        displaySubjects: function() {
            let subjects = model.getAllSubjects();
            let days = Object.keys(subjects);
            //console.log(days);
            days.forEach(function(elem) {
                let selector = elem.toLowerCase();
                let daySubjects = subjects[elem];
                let paragraphs = document.getElementsByClassName(selector);
                //console.log(paragraphs);
                for (let i = 0; i < daySubjects.length; i++) {
                    let text = document.createTextNode(daySubjects[i]);
                    paragraphs[i].appendChild(text);
                }
            });
        },

        displayHomeworks: function() {
            let homeworks = model.getAllHomeworks();
            let days = Object.keys(homeworks);
            console.log(days);
            days.forEach(function(elem) {
               let selector = elem.toLowerCase();
               let dayHomeworks = homeworks[elem];
               for (let i = 0; i < dayHomeworks.length; i++) {
                   let subject = dayHomeworks[i].subject;
                   $("." + selector).each(function() {
                       let text = $(this).text();
                       if (text === subject) {
                           let div = $(this).parent().next().next().find(".card-body");
                           div.append("<p>" + dayHomeworks[i].content + "</p>");
                       }
                   });
               }
            });
        }
    };

    controller.init();
});