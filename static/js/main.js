'use strict';

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("js/worker.js")
        .then((registration) => {
            console.log("Service Worker registered with scope: ", registration.scope);
        }).catch((error) => {
            console.log("Service Worker registration failed:", error);
        });
}

$(document).ready(function() {

    let homeworks = {
        Luni: {},
        Marti: {},
        Miercuri: {},
        Joi: {},
        Vineri: {}
    };

    if(window.localStorage) {
        if (!localStorage.getItem('Materii')) {
            fetch("../json/classes.json").then(function(response) {
                if (response.ok) {
                    return response.json()
                }
                throw new Error('Network response was not ok.');
            }).then(function(data) {
                localStorage.setItem("Materii", JSON.stringify(data));
                console.log("Stocare materii initiale");
            }).catch(function(error) {
                console.log("There has been a problem in retreiving the data: ", error.message);
            });

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

        setSubject: function(day, index, newSubj) {
            let daySubjects = this.getDaySubjects(day);
            //console.log(daySubjects);
            daySubjects[index] = newSubj;
            let classes = this.getAllSubjects();
            classes[day] = daySubjects;
            localStorage.setItem('Materii', JSON.stringify(classes));
        },

        getAllHomeworks: function() {
            return JSON.parse(localStorage.getItem("Teme"));
        },


        setHomework: function(day, subject, content) {
            let homeworks = this.getAllHomeworks();
            homeworks[day][subject] = content;
            localStorage.setItem('Teme', JSON.stringify(homeworks));
        }
    };

    let controller = {
        init: function() {
            //$('tr').sortable();

            $('.icon-edit').on('click', function() {
                let elem = $(this).prev();
                //console.log(elem);
                elem.attr('contenteditable', true);
                elem.css('borderBottom', '1px solid blue');
            });

           $('.icon-save').on('click', function() {
                let elem = $(this).prev().prev();
                let changedValue = elem.text();
                let value = elem.attr('class').slice(0, -8);
                let day = value.slice(0, -2);
                //console.log(day);
                let index = value.slice(-1);
                //console.log(index);
                day = day[0].toUpperCase() + day.slice(1).toLowerCase();
                //console.log(day);
                model.setSubject(day, index, changedValue);
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
               //console.log(day);
               let subject = $(this).parent().prev().prev().children().first().text();
               subject.trim();
               //console.log(subject);
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
                let daySubjects = subjects[elem];
                //console.log(daySubjects);
                let paragraphs = document.querySelectorAll(`span[class*="${elem.toLowerCase()}"]`);
                //console.log(paragraphs);
                for (let i = 0; i < daySubjects.length; i++) {
                    let text = document.createTextNode(daySubjects[i]);
                    paragraphs[i].appendChild(text);
                }
            });
        },

        displayHomeworks: function() {
            let homeworks = model.getAllHomeworks();
            //console.log(homeworks);
            let days = Object.keys(homeworks);
            days.forEach(function(elem) {
               let selector = elem.toLowerCase();
               let dayHomeworks = homeworks[elem];
               let keys = Object.keys(dayHomeworks);
               //console.log(keys);
               for (let i = 0; i < keys.length; i++) {
                   let div = $("#" + selector + "_" + i).children().eq(2);
                   div.append("<p>" + dayHomeworks[keys[i]] + "</p>");
               }
            });
        }
    };

    controller.init();
});