var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
	var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
    
module.exports = {

	accountSid:'AC84c435748e9748678e81a1d6959f03dc',
    authToken:'ad900facc8901e4150884128c1100a36',
    twilioNumber:'+16464900241', // e.g. '+15692878254'
	port: server_port, 
	ip: server_ip_address
}