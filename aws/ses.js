let aws = require('aws-sdk');

let ses;

module.exports.setupSES = function(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION)
{
    ses = new aws.SES(
        {
            'accessKeyId': AWS_ACCESS_KEY_ID,
            'secretAccessKey': AWS_SECRET_ACCESS_KEY,
            'region': AWS_REGION
        });
};

module.exports.sendResetPasswordEmail = function(recipientAddress, emailVerificationCode)
{
    let params =
        {
            Destination:
                {
                    ToAddresses: [recipientAddress]
                },
            Message:
                {
                    Body:
                        {
                            Html:
                                {
                                    Charset: 'UTF-8',
                                    Data: 'Password reset code: ' + emailVerificationCode
                                },
                            Text:
                                {
                                    Charset: 'UTF-8',
                                    Data: 'Password reset code: ' + emailVerificationCode
                                }
                        },
                    Subject:
                        {
                            Charset: 'UTF-8',
                            Data: 'ChronoWiz Password verification'
                        }
                },
            Source: 'fikak@chronowiz.com',
        };

    return new Promise(function(resolve, reject)
    {
        ses.sendEmail(params, function(err, data)
        {
            if(err)
                return reject(err);
            return resolve(data);
        });
    });
};

module.exports.sendGenericMail = function(emailAddresses, subject, body)
{
    let params =
        {
            Destination:
                {
                    ToAddresses: emailAddresses
                },
            Message:
                {
                    Body:
                        {
                            Html:
                                {
                                    Charset: 'UTF-8',
                                    Data: body
                                },
                            Text:
                                {
                                    Charset: 'UTF-8',
                                    Data: body
                                }
                        },
                    Subject:
                        {
                            Charset: 'UTF-8',
                            Data: subject
                        }
                },
            Source: 'fikak@chronowiz.com',
        };

    return new Promise(function(resolve, reject)
    {
        ses.sendEmail(params, function(err, data)
        {
            if(err)
                return reject(err);
            return resolve(data);
        });
    });

};
