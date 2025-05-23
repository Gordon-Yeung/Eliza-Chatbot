

/* TODO 2: Add a wildcard response handler
 * The patterns above in the responses variable are helpful if the user contains the EXACT keyword/phrase. What if
 * we want to capture responses that can vary in meaning? Add a wildcard response handler that replaces the wildcard
 * phrase with a replacementWord from one of the keywords in responses above - you may want to add another entry in 
 * responses to do this :)
 * 
 * Syntax:
 * 
 *		*1-5* 		->   "1 to 3 words" 
 * 
 * "i am *1-3* happy" -> "i am happy"... iow - If there are 1-3 words in between "am" and "happy", we just convert it to "I am happy"
 *
 * Example Conversation:
 * User> I am extremely happy    ->    this becomes "I am happy"
 * Eliza> Why are you happy?
 * 
 */
var responsesWithWildcard = {
	"i am *1-3* happy" : {	
							weight : 20,
							replacementWord : "i am happy"
						},
	"i am *1-3* sad" : {	
							weight : 20,
							replacementWord : "i am sad"
						},
	"i am *1-3* bored" : {	
							weight : 20,
							replacementWord : "i am bored"
						}
	
};


var initialMessages = ["Hello. How are you feeling today?"];
var endChatTerms = ["goodbye","I have to leave","I have to leave.","quit","bye","exit"];
var chatHistory = [];
var keywords = [];
var conversationOver = false;
var usedResponses = [];


/*
 * Initial function to start the coversation with
 * Eliza. This decides the initial message.
 *
 * Adds response keywords and synonyms with weight.
 * Sorts the responses by weight so the more important
 * meaningful is found first.
 */
function startElizaChat(){
	
	//sorts keywords (keywords and similar word) into array based on weight.
	getKeywordsByWeight();

	// Choose a random introductory message from the initialMessages array above.
	var initialMessage = initialMessages[Math.floor(Math.random()*initialMessages.length)];

	// Add to our chatHistory this first introductory message from Eliza!
	chatHistory.push({ isEliza : true, content : initialMessage });

	// Refresh the Chat UI to show the new introductory message
	displayChat();

}

/*
 * This function finds all of the response keywords and their
 * weight. Then finds all of the similar words and their weight (based on response keywords). 
 * Then it sorts the whole list.
 * 
 */
function getKeywordsByWeight(){
	var weights = [];
	var tempKeywords = [];

	//For each keyword in the "responses" array:
	// 1) Add the keyword to the tempKeywords object
	for(var responseKeyword in responses){
		var weight = responses[responseKeyword].weight;
		tempKeywords[responseKeyword] = weight;

		if(!weights.includes(weight)){
			weights.push(weight);
		}
	}

	
	//Add similar words
	for(var wordWithResponse in synonyms){
		if(wordWithResponse in tempKeywords){
			var weight = tempKeywords[wordWithResponse];

			for(var i = 0;i < synonyms[wordWithResponse].length;i++){
				var similarWord = synonyms[wordWithResponse][i];
				tempKeywords[similarWord] = weight;
			}
		}//otherwise ignores it
	}

	//Adds responsesWithWildcard
	for (var word in responsesWithWildcard){
		var weight = responsesWithWildcard[word].weight;

		if (!weights.includes(weight)){
			weights.push(weight);
		}
		
		tempKeywords[word] = weight;
	}

	//Sorts them based on weight going from highest to lowest
	weights = weights.sort(sortNumber);
	
	//Populates keywords for final result to be used throughout
	for (var i = 0; i < weights.length; i++) {
		var weight = weights[i];
		for (var word in tempKeywords) {
			//NOT FOUND is the fallback word. So if it loops through all
			//and none match it will be this word.
			if(tempKeywords[word] === weight && word != "NOTFOUND"){
				var obj = {};
				obj.word = word;
				obj.weight = weight;

				keywords.push(obj);
			}
		}
	}
}
/* This function is called everytime the user sends Eliza a message.
 * 
 * 1) We update the chatHistory to account for the user's new message
 * 2) We update the UI to show that the user has sent a message
 * 3) We clear the input textbox 
 * 4) If the conversation isn't over, we process the input (to be readable)
 * 5) and then we analyze the User's input to determine Eliza's response
 */
function sendElizaNewMessage(newMessage){
	
	//Add to UI
	chatHistory.push({ isEliza : false, content : newMessage });
	displayChat();
	clearSendTextbox();

	if(!conversationOver){
		// Makes it lower case + removes punctuation
		newMessage = processInput(newMessage);

		// Determine Eliza's response based on the input.
		var response = analyze(newMessage);
	}else{
		var response = "Our conversation has ended. Refresh the page to start again.";
	}

	// Shows the reply from Eliza. To make it seem more real, takes a
	// random short time to response. Reloads the chat.
	setTimeout(function(){

		// Update chatHistory with Eliza's response and update chatUI with displayChat()
		usedResponses.push(response);
		chatHistory.push({ isEliza : true, content : response });
		displayChat();

	}, determineResponseTime());

}

/*
 * Analyze is Eliza's main function for getting a response based on
 * the user's current input. It also takes into consideration past messages.
 *
 * 1) Iterate through all keywords to see if they are contained in the user's message
 */
function analyze(newMessage){
	var found = false;
	var response = '';

	//Check all keywords to see if they are contained in the User's input
	for (var i = 0;i < keywords.length;i++) {
		var word = keywords[i].word;
		
		// If the user's input contained a phrase indicating end of chat, mark the convo as over.
		if(endChatTerms.contains(newMessage)){
			conversationOver = true;
			newMessage = "goodbye";
		}

		// Check for a wild card (*) in the keyword (ex: "i am *1-3* happy")
		// Also checks if the newMessage contains all parts in proper order and following the rules
		if(word.indexOf("*") != -1 && containsKeywordWithWildcard(newMessage, word) && !found){
			
			response = selectResponse(findBasicKeywordFromKeywordWithWildcard(word));
			found = true;

		// otherwise if it isn't a wild card keyword, check if the keyword is simply contained in the message
		} else if ((newMessage.indexOf(word) != -1 && newMessage.length == word.length || newMessage.indexOf(word + " ") != -1 || newMessage.indexOf(" " + word) != -1) && !found){
			//Check to see if the keyword is in the sentence
			//Ex. input is "Hi" or "This and more" or "Hi doc!"
			
			//This picks a response
			response = selectResponse(word);
			
			//Check for wild card
			found = true;

		}
		

		if (found && response.indexOf("*") !== -1) {
			// Wild card exists so sub in the phrase
			// Example: I had a dream about my dog.
			// 		*Dream is the keyword
			

			// remainingInput = all characters to the right of the keyword in the incoming message
			var remainingInput = newMessage.substring(newMessage.indexOf(word) + word.length + 1, newMessage.length);
			// [I had a dream about my dog] -> [about my dog]
			
			//Right of the wildcard in the response
			var rightOfWildcardInResponse = response.substring(response.indexOf("*") + 1);
			//Right of Wildcard In Response: [ while you were awake?]

			//Start of the response to the wildcard
			var startOfResponseToWildcard = response.substring(0, response.indexOf("*"));
			//Start of response to wildcard: [Have you ever fantasized]

			//The start of the remainingInput to the end minus the one character
			var startOfInputMinusOneCharacter = remainingInput.substring(0, remainingInput.length-1);
			//Start of input minus one character: [about my do]

			//This is remaining of the remaining input.
			//Regular expression replaces things that are not either A-Z or a-z
			var remainingOfInputOnRight = remainingInput.substring(remainingInput.length-1, remainingInput.length).replace("[^A-Za-z]","");
			//Remaining of Input on Right: [g]


			response =  startOfResponseToWildcard + replaceWords(startOfInputMinusOneCharacter + remainingOfInputOnRight) + rightOfWildcardInResponse;
			//Response: Have you ever fantasized about my dog while you were awake?

			//Changes the words and fixes the tenses.
			//Ex. I had a dream about my dog. --> Have you ever fantasized about your dog while you were awake?
			//But it only should work on the input not the response so you apply it to the inner parts.
		}

		if (found) {
			break;
		}
		

	}

	if(!found){
		response = responses["NOTFOUND"].responses[Math.floor(Math.random()*responses["NOTFOUND"].responses.length)];
	}

	return response;
}
/*
 * Selects one of the responses based on a few things:
 * - Random (so responses aren't consistant)
 * - if contains wild card
 * - The responses passed in hold the highest value
 * - Checks if the response has been used already
 * 
 * I decided to add an additional(duplicate) response
 * instead of removing because I dont know how long the
 * conversation will go on for.
 *
 * Reason for creating a second array instead of manipulating
 * the existing one was because of a bug where it would
 * duplicate the duplicate.
 */
function selectResponse(word){
	var potentialResponses = [];
	if(word in responses){
		//Easily find responses by using key value pairing
		potentialResponses = responses[word];
	}else{
		//Need to find the related responses
		potentialResponses = findResponsesForSimilarWord(word);
	}

	var newResponses = [];
	var originalResponsesSize = potentialResponses.responses.length;


	for(var i = 0;i < originalResponsesSize;i++){
		newResponses.push(potentialResponses.responses[i]);

		//If has wild card, adds another
		if(potentialResponses.responses[i].indexOf("*") !== -1){
			newResponses.push(potentialResponses.responses[i]);
		}

		//If the response hasnt been used
		if(!usedResponses.contains(potentialResponses.responses[i])){
			newResponses.push(potentialResponses.responses[i]);
		}
	}
	return newResponses[Math.floor(Math.random()*newResponses.length)];
}
/*
 * Process input by making input lower case
 * and remove unnessary punctuation. 
 */
function processInput(message){
	message = message.toLowerCase();
	message = removePunctuation(message);
	return message;
}
/*
 * Replaces the context of words, flipping
 * the voice from the user to eliza.
 * 
 * It's split into an array so it doesn't
 * replace back and forth. Ex. me->i i->me
 */
function replaceWords(input){
	
	var wordsForReplacement = [];
	wordsForReplacement["i"] = "you";
	wordsForReplacement["you"] = "i";
	wordsForReplacement["me"] = "you";
	wordsForReplacement["my"] = "your";
	wordsForReplacement["am"] = "are";
	wordsForReplacement["are"] = "am";
	wordsForReplacement["was"] = "were";
	wordsForReplacement["i'd"] = "you would";
	wordsForReplacement["i've"] = "you have";
	wordsForReplacement["i'll"] = "you will";
	wordsForReplacement["you've"] = "i have";
	wordsForReplacement["you'll"] = "i will";
	wordsForReplacement["your"] = "my";
	wordsForReplacement["yours"] = "mine";
	wordsForReplacement["me"] = "you";
	//Added in after testing
	wordsForReplacement["always had"] = "always have";
	
	
	var inputSplit = input.split(" ");

	//Was having an overrite issue
	var newSplit = [];
	for(var i = 0;i < inputSplit.length;i++){
		var currentInputWord = inputSplit[i];
		if(currentInputWord in wordsForReplacement){
			var replacementWord = wordsForReplacement[currentInputWord];
			newSplit[i] = replacementWord;

			//I had a dream about my dog.
		}else{
			newSplit[i] = currentInputWord;
		}
	}

	var updatedMessage = "";
	for(var i = 0;i < newSplit.length;i++){
		var word = newSplit[i];
		if(updatedMessage != ""){
			updatedMessage += " ";
		}
		updatedMessage += word;
	}

	return updatedMessage;
}

/*
 * Removes basic punctuation from the
 * user input message.
 */
function removePunctuation(message){
	//',;.?!:'
	message = message.replace(",","");
	message = message.replace(";","");
	message = message.replace(".","");
	message = message.replace("?","");
	message = message.replace("!","");
	message = message.replace(":","");
	
	
	return message;
}

/*
 * Randomly generate a response time
 */
function determineResponseTime(){
	var m = Math.floor(Math.random() * 1000);
	return m;
}
/*
 * Taken from: http://stackoverflow.com/questions/1063007/how-to-sort-an-array-of-integers-correctly
 * modified by Keith Weaver
 */
function sortNumber(a,b) {
    return b - a;
}

/*
 * This function is used to find responses for similar words / synonyms, 
 by looking up the key of the similar word. Then it fetches the appropriate
 responses that ELIZA should give. 
 */
function findResponsesForSimilarWord(word){
	// have students implement this search algorithm essentially 

	var foundKey = "";
	for(var key in synonyms){
		var similarWords = synonyms[key];
		for(var i = 0;i < similarWords.length;i++){
			if(similarWords[i] == word){
				foundKey = key;
				break;
			}
		}
		if(foundKey != ""){
			break;
		}
	}

	//Find responses for that key
	return responses[foundKey];
}

/*
 * Checks to see if the keyword exists properly 
 * so "I am happy" is in proper order. Also 
 * checks to against runs so only so many words
 * are between "am" and "happy". So
 * "I am extremely happy" but 
 * "I am sad because I am happy" would fail.
 */
function containsKeywordWithWildcard(input, keywordsWithWildcardStr){
	
	var responseWildcardObj = getResponseWildcardInfo(keywordsWithWildcardStr);

	var numberOfWordsInWildcard = 0;
	var foundKeywords = 0;
	var inputArray = input.split(" ");
	for(var i = 0;i < inputArray.length;i++){
		var currentWord = inputArray[i];
		
		//if the word is not a keyword, add it. and we are in the wildcard
		if((foundKeywords >= responseWildcardObj.minNumWords && foundKeywords <= responseWildcardObj.maxNumWords) && !responseWildcardObj.keywords.contains(currentWord)){
			numberOfWordsInWildcard++;
		}

		if(responseWildcardObj.keywords.length > 0 && currentWord == responseWildcardObj.keywords[0]){
			//so first this would be "i" for ["i","am","happy"]
			responseWildcardObj.keywords.remove(currentWord);
			foundKeywords++;
		}
	}

	//Doesnot have all keywords
	//"I am * sad"
	//"I am * happy"
	//> I am extremely happy
	//Sad should stop here cause its not valid
	if(responseWildcardObj.keywords.length > 0){
		//console.log("Not the correct keyword");
		return false;
	}
	if(!(numberOfWordsInWildcard >= responseWildcardObj.minNumWords && numberOfWordsInWildcard <= responseWildcardObj.maxNumWords)){
		//console.log("Does not follow wildcard rules");
		return false;
	}
	
	return true;
}

/*
 * Find the replacement word so "I am extremely happy" would return "I am happy"
 */
function findBasicKeywordFromKeywordWithWildcard(keywordsWithWildcardStr){
	var t =  responsesWithWildcard[keywordsWithWildcardStr].replacementWord;
	console.log("Replacement:" + t);
	return t;
}

/*
 * Creates an object about the response replacement.
 * It breaks the keywords in an array. With the position
 * of the word before the wildcard and the position of
 * the word after the wildcard. Also with the max and min
 * number of words.
 */
function getResponseWildcardInfo(keywordsWithWildcardStr){
	var keywordsWithWildcard = keywordsWithWildcardStr.split(" ");
	
	var rulesInSingleStr = "";
	var positionOfWordBeforeOfWildcard = 0;
	var positionOfWordAfterOfWildcard = 0;
	for(var i = 0;i < keywordsWithWildcard.length;i++){
		var str = keywordsWithWildcard[i];
		
		positionOfWordAfterOfWildcard = i;
		//gets the position of wild card
		//since its going to be removed, we know
		//this is where the word "happy" should be

		if(str.indexOf("*") != -1){
			rulesInSingleStr = str;
			break;
		}
	}
	positionOfWordBeforeOfWildcard = positionOfWordAfterOfWildcard-1;


	//["i","am","*1-3*","happy"]
	keywordsWithWildcard = keywordsWithWildcard.remove(rulesInSingleStr);
	//["i","am","happy"]
	rulesInSingleStr = rulesInSingleStr.replace("*","").replace("*","");//*1-3* --> 1-3
	if(rulesInSingleStr.length < 3){
		return false;
	}
	//Now know the upper and lower bounds for the number of accepted words in the wildcard
	var minNumWords = rulesInSingleStr.substring(0,1);
	var maxNumWords = rulesInSingleStr.substring(2);
	

	var obj = {
		minNumWords : minNumWords,
		maxNumWords : maxNumWords,
		wordBeforeWildcard : positionOfWordBeforeOfWildcard,
		wordAfterWildcard : positionOfWordAfterOfWildcard,
		keywords : keywordsWithWildcard
	};


	return obj;
}

/* Removes string "needle" from array if it exists
 * Taken from: http://stackoverflow.com/questions/5767325/how-to-remove-a-particular-element-from-an-array-in-javascript
 * Modified
 */
Array.prototype.remove = function ( needle ) {
	var index = this.indexOf(needle);
	
	if(index > -1){
		this.splice(index, 1);
		return this;
	}
	return this;
}
/* We add a method ".contains" property to the Array object!
 * Checks if a string array contains the string "needle"
 * Taken from: http://stackoverflow.com/questions/12623272/how-to-check-if-a-string-array-contains-one-string-in-javascript
 */
Array.prototype.contains = function ( needle ) {
   for (i in this) {
      if (this[i] == needle) return true;
   }
   return false;
}
