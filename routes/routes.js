export default function SuggestionRoutes(spazaSuggest){
    //Register a spaza client 
        //Get the registration details from the request object
        //Validate the username
        //If valid
            //Call the register client method of the Spaza Suggest module
            //Success status to the response object 
            //Render the login screen 
        //Else
            //Return the "Invalid name" error 
            //Redirect to the register page 
    //Register spaza client ends

    async function registerSpazaClient(req, res){
        let clientName = req.body.client;
        let password = req.body.password;
        let email  = req.body.email; 

        //Validate the username
        let validated = validateUsername(clientName);

        if(validated == clientName){
            const clientCode = await spazaSuggest.registerClient(clientName);
            res.status = 200;
            res.render('login', {code: clientCode, client: clientName})
        } else {
            req.flash('Error', validated);
            res.render('register');
        }
    }

    //Login spaza client 
        //Get the username and password from the request object - code
        //Validate the name
        //Confirm the is the passwords match 
        //If both is well, 
            //status 200
            //render the suggestions made by the client
        //Else
            //error
            //redirect to the login view
    //Login spaza client ends

    async function spazaClientLogin(req, res){
        let code = req.body.code;
        //Call the Spaza Suggest method and pass the code 
        let client =  await spazaSuggest.clientLogin(code);

        res.status = 200;
        res.render('suggestProduct', {client: client});
    }

    //Suggest product
        //Get the AreaId, client ID and suggested product from the request object
        //Call the Spaza Suggest method that adds a suggestion to a table
        //Render a view / Redirect to suggestProduct
    //Suggest product ends

    async function clientSuggest(req, res){
        let areaID = req.body.areaid;
        let clientID = req.body.clientid;
        let suggestion = req.body.suggestion;

        await spazaSuggest.suggestProduct(areaID, clientID, suggestion);

        res.redirect('suggestProduct');
    }

    //Client suggestions 
        //Get the clientID from the request object 
        //Call the Spaza Suggest method that returns that suggestions the client
        //Render a view to display the suggestions for the client
    //Client suggestions ends

    async function clientSuggestions(req, res){
        let clientID  = req.body.clientid;

        let clientSuggestions = await spazaSuggest.suggestions(clientID);

        res.render('clientSuggestions', {suggestions: clientSuggestions});
    }

    //Validate the username 
        //Declare a regular expression to test the username on
        //Return "TRUE" if the username is valid, or return string "Invalid name"
    //Validate the username ends

    function validateUsername(username){
        let regex = /^[a-zA-Z\s]+$/;;
       
        return regex.test(username) ? username : "Invalid username";
    }

    return {
        registerSpazaClient,
        spazaClientLogin,
        clientSuggest,
        clientSuggestions
    }

}