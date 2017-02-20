/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');
const Http = require('http');
const request = require('request');

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.appId = process.env.appId;
    
    // To enable string internationalization (i18n) features, set a resources object.
    // alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const LGXSCREEN = {
    'category':"Mobile",
    'name':"L.G. X. Screen",
    'price':900
}
const LGV20 = {
    'category':"Mobile",
    'name':"L.G. V.20",
    'price':10
}
const LGHAUZEN = {
    'category':"Appliance",
    'name':"L.G. Hauzen",
    'price':1000
}

const catalogue = {
    'categories':[
    {
        'categoryName':"Mobile",
        'products':[
            LGXSCREEN,
            LGV20]
    },
    {
        'categoryName':"Appliance",
        'products':[
            LGHAUZEN]
    }
    ]
}

var currentProduct;
var viewedProduct;

const handlers = {
    'SeeLive': function() {
        const productName = "L.G. X. Screen is on sale! You can get it at only 900$."
        viewedProduct = LGXSCREEN;
        this.emit(':ask', productName +" " + "In order to buy it, just say 'I want it'");
    },
    'SeeCatalogue': function() {
        var speech = "";
        for(var category of catalogue.categories) {
            speech += " There are " + category.products.length + " products in " + category.categoryName + ".";
        }
        var reprompt = " Which category do you want to see?";
        this.emit(':ask', speech + reprompt, reprompt);
    },
    'Purchase': function() {
        currentProduct = viewedProduct;
        
        var speech = "You purchased " + currentProduct.name + " on " + currentProduct.price + "$.";
        var reprompt = " Thank you for your purchase.";
        reprompt += " Is there any help you need?";
        this.emit(':ask', speech + reprompt, reprompt );
    },
    'SeeDeliveries': function () {
        const alexaHandler = this;
        console.log("requesting on " + "http://" + process.env.VoiceShopServerHost + "/deliveries");
        request.get(
            {
                "url":"http://" + process.env.VoiceShopServerHost + "/deliveries",
                "body":"{}"
            },
            function(error,response,body) {
                var speech = "";
                var prompt = "";
                
                var deliveries = JSON.parse(body);
                
                speech += " There are " + deliveries.length + " deliveries ongoing. ";
                
                speech += " They are now at ";
                for(var delivery of deliveries) {
                    speech += " " + delivery.currentLocation + ", ";
                }
                
                // prompt = " If you want to know about detail, please tell me the name, current location, or the category of the product.";
                prompt = " If you want to know about the detail, please tell me the index of the product";
                
                alexaHandler.emit(':ask',speech + prompt, prompt);
            });
    },
    'ChooseDelivery': function() {
    },
    'LaunchRequest': function () {
        this.emit(':ask', "Welcome to Voice Shop");
    },
    'AMAZON.HelpIntent': function () {
        const reprompt = "For more information, please check the card on your alexa app.";
        this.emit(':ask', "To see the list of ongoing deliveries please ask me about deliveries. " + reprompt , reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', "OK, bye.");
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', "Roger. Have a Good day!");
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', "OK, bye.");
    }
};

/////////////////////////////////////////
// const languageStrings = {
//     'en-GB': {
//         translation: {
//             FACTS: [
//                 'A year on Mercury is just 88 days long.',
//                 'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
//                 'Venus rotates anti-clockwise, possibly because of a collision in the past with an asteroid.',
//                 'On Mars, the Sun appears about half the size as it does on Earth.',
//                 'Earth is the only planet not named after a god.',
//                 'Jupiter has the shortest day of all the planets.',
//                 'The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.',
//                 'The Sun contains 99.86% of the mass in the Solar System.',
//                 'The Sun is an almost perfect sphere.',
//                 'A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.',
//                 'Saturn radiates two and a half times more energy into space than it receives from the sun.',
//                 'The temperature inside the Sun can reach 15 million degrees Celsius.',
//                 'The Moon is moving approximately 3.8 cm away from our planet every year.',
//             ],
//             SKILL_NAME: 'British Space Facts',
//             GET_FACT_MESSAGE: "Here's your fact: ",
//             HELP_MESSAGE: 'You can say tell me a space fact, or, you can say exit... What can I help you with?',
//             HELP_REPROMPT: 'What can I help you with?',
//             STOP_MESSAGE: 'Goodbye!',
//         },
//     },
//     'en-US': {
//         translation: {
//             FACTS: [
//                 'A year on Mercury is just 88 days long.',
//                 'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
//                 'Venus rotates counter-clockwise, possibly because of a collision in the past with an asteroid.',
//                 'On Mars, the Sun appears about half the size as it does on Earth.',
//                 'Earth is the only planet not named after a god.',
//                 'Jupiter has the shortest day of all the planets.',
//                 'The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.',
//                 'The Sun contains 99.86% of the mass in the Solar System.',
//                 'The Sun is an almost perfect sphere.',
//                 'A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.',
//                 'Saturn radiates two and a half times more energy into space than it receives from the sun.',
//                 'The temperature inside the Sun can reach 15 million degrees Celsius.',
//                 'The Moon is moving approximately 3.8 cm away from our planet every year.',
//             ],
//             SKILL_NAME: 'American Space Facts',
//             GET_FACT_MESSAGE: "Here's your fact: ",
//             HELP_MESSAGE: 'You can say tell me a space fact, or, you can say exit... What can I help you with?',
//             HELP_REPROMPT: 'What can I help you with?',
//             STOP_MESSAGE: 'Goodbye!',
//         },
//     },
//     'de-DE': {
//         translation: {
//             FACTS: [
//                 'Ein Jahr dauert auf dem Merkur nur 88 Tage.',
//                 'Die Venus ist zwar weiter von der Sonne entfernt, hat aber höhere Temperaturen als Merkur.',
//                 'Venus dreht sich entgegen dem Uhrzeigersinn, möglicherweise aufgrund eines früheren Zusammenstoßes mit einem Asteroiden.',
//                 'Auf dem Mars erscheint die Sonne nur halb so groß wie auf der Erde.',
//                 'Die Erde ist der einzige Planet, der nicht nach einem Gott benannt ist.',
//                 'Jupiter hat den kürzesten Tag aller Planeten.',
//                 'Die Milchstraßengalaxis wird in etwa 5 Milliarden Jahren mit der Andromeda-Galaxis zusammenstoßen.',
//                 'Die Sonne macht rund 99,86 % der Masse im Sonnensystem aus.',
//                 'Die Sonne ist eine fast perfekte Kugel.',
//                 'Eine Sonnenfinsternis kann alle ein bis zwei Jahre eintreten. Sie ist daher ein seltenes Ereignis.',
//                 'Der Saturn strahlt zweieinhalb mal mehr Energie in den Weltraum aus als er von der Sonne erhält.',
//                 'Die Temperatur in der Sonne kann 15 Millionen Grad Celsius erreichen.',
//                 'Der Mond entfernt sich von unserem Planeten etwa 3,8 cm pro Jahr.',
//             ],
//             SKILL_NAME: 'Weltraumwissen auf Deutsch',
//             GET_FACT_MESSAGE: 'Hier sind deine Fakten: ',
//             HELP_MESSAGE: 'Du kannst sagen, „Nenne mir einen Fakt über den Weltraum“, oder du kannst „Beenden“ sagen... Wie kann ich dir helfen?',
//             HELP_REPROMPT: 'Wie kann ich dir helfen?',
//             STOP_MESSAGE: 'Auf Wiedersehen!',
//         },
//     },
// };