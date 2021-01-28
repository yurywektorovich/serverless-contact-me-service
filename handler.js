"use strict";

const AWS = require("aws-sdk");
const SES = new AWS.SES();

const sendEmail = (formData, callback) => {
	const emailParams = {
		Source: "yurywektorovich@gmail.com", // SES SENDING EMAIL
		ReplyToAddresses: [formData.email],
		Destination: {
			ToAddresses: ["yurywektorovich@gmail.com"], // SES RECEIVING EMAIL
		},
		Message: {
			Body: {
				Text: {
					Charset: "UTF-8",
					Data: `${formData.message}\n\nName: ${formData.name}\nEmail: ${formData.email}`,
				},
			},
			Subject: {
				Charset: "UTF-8",
				Data: "New message from yurywektorovich.netlify.app",
			},
		},
	};

	SES.sendEmail(emailParams, callback);
};

module.exports.staticSiteMailer = (event, context, callback) => {
	const formData = JSON.parse(event.body);

	sendEmail(formData, function (err, data) {
		const response = {
			statusCode: err ? 500 : 200,
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "https://yurywektorovich.netlify.app",
			},
			body: JSON.stringify({
				message: err ? err.message : data,
			}),
		};

		callback(null, response);
	});
};
