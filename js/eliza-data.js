/* TODO 1: Edit responses with your own rules to make ELIZA better. Add at least 1!
 * Responses is a Key-Value Object.
 *		Key: a Keyword to look for in the User's Input
 *		Value: An object with two fields: "weight" and "responses"
 *			"weight": The Importance of this keyword in comparison to other Keywords
 *			"responses": Possible things for the chatbot to say back if this Keyword is detected
 */
var responses = {
	"NOTFOUND" : {
				 "weight" : 0,
				 "responses" : [
						"What does that suggest to you?",
						"I see.",
						"I'm not sure I understand you fully.",
						"Can you elaborate?",
						"That is quite interesting.",
						"Please tell me more.",
						"Let's change focus a bit... Tell me about your family.",
						"Can you elaborate on that?",
						"Why do you say that *?"
					]
				},
	"sorry" : {
				 "weight" : 1,
				 "responses" : ["Please don't apologize.", "Apologies are not necessary.", "Apologies are not required."]},
	"always" : {
				 "weight" : 1,
				 "responses" : ["Can you think of a specific example?"]},
	"because" : {
				 "weight" : 6,
				 "responses" : ["Is that the real reason?"]},
	"maybe" : {
				 "weight" : 1,
				 "responses" : ["You  don't seem very certain."]},
	"i think" : {
				 "weight" : 2,
				 "responses" : ["Do you really think so?"]},
	"you" : {
				 "weight" : 1,
				 "responses" : ["We were discussing you, not me.","Why do you say that about me?"]},
	"yes" : {
				 "weight" : 1,
				 "responses" : ["Why do you think so?","You seem quite positive."]
				},
	"no" : {
				 "weight" : 1,
				 "responses" : ["Why not?","Are you sure?"]},
	"i am" : {
				 "weight" : 1,
				 "responses" : ["I am sorry to hear you are *.","How long have you been *?","Do you believe it is normal to be *?","Do you enjoy being *?","Did you come to me because you are *?"]},
	"i feel" : {
				 "weight" : 4,
				 "responses" : ["Tell me more about such feelings.","Do you often feel *?","Do you enjoy feeling *?","Why do you feel that way?"]},
	"family" : {
				 "weight" : 16,
				 "responses" : ["Tell me more about your family.","How do you get along with your family?","Is your family important to you?"]},
	"mother" : {
				 "weight" : 16,
				 "responses" : ["Tell me more about your family.","How do you get along with your family?","Is your family important to you?"]},
	"father" : {
				 "weight" : 16,
				 "responses" : ["Tell me more about your family.","How do you get along with your family?","Is your family important to you?"]},
	"mom" : {
				 "weight" : 16,
				 "responses" : ["Tell me more about your family.","How do you get along with your family?","Is your family important to you?"]},
	"sister" : {
				 "weight" : 16,
				 "responses" : ["Tell me more about your family.","How do you get along with your family?","Is your family important to you?"]},
	"brother" : {
				 "weight" : 16,
				 "responses" : ["Tell me more about your family.","How do you get along with your family?","Is your family important to you?"]},
	"husband" : {
				 "weight" : 16,
				 "responses" : ["Tell me more about your family.","How do you get along with your family?","Is your family important to you?"]},
	"wife" : {
				 "weight" : 16,
				 "responses" : ["Tell me more about your family.","How do you get along with your family?","Is your family important to you?"]},
	"child" : {
				 "weight" : 16,
				 "responses" : ["Did you have close friends as a child?",
				 	"What is your favorite childhood memory?",
				 	"Do you remember any dreams or nightmares from childhood?",
				 	"Did the other children sometimes tease you?",
				 	"How do you think your childhood experiences relate to your feelings today?"]},
	"nightmare" : {
				 "weight" : 3,
				 "responses" : ["What does that dream suggest to you?",
				 	"Do you dream often?","What persons appear in your dreams?",
				 	"Are you disturbed by your dreams?"]},
	"dreamed" : {
				 "weight" : 4,
				 "responses" : ["What does that dream suggest to you?",
				 	"Do you dream often?","What people appear in your dreams?",
				 	"Are you disturbed by your dreams?",
				 	"Have you ever fantasized * while you were awake?"]},
	"hello" : {
				 "weight" : 1,
				 "responses" : ["Hi again! How is going?","How are you today? Any problems?"]},
	"good afternoon" : {
				 "weight" : 1,
				 "responses" : ["Hi again! How is going?","How are you today? Any problems?"]},
	"good morning" : {
				 "weight" : 1,
				 "responses" : ["Hi again! How is going?","How are you today? Any problems?"]},
	"hi" : {
				 "weight" : 1,
				 "responses" : ["Hi again! How is going?","How are you today? Any problems?"]},
	"goodbye" : {
				 "weight" : 1,
				 "responses" : ["Goodbye.  Thank you for talking to me."]},
	"i need" : {
				 "weight" : 5,
				 "responses" : ["Why do you need *?","Would it really help you to get *?","Are you sure you need *?"],},
	"why don\'t you" : {
				 "weight" : 3,
				 "responses" : ["Do you really think I don't *?","Perhaps eventually I will *.","Do you really want me to *?"],},
	"why can\'t i" : {
				 "weight" : 3,
				 "responses" : ["Do you think you should be able to *?","If you could *, what would you do?","I don't know -- why can't you *?","Have you really tried?"],},
	"i can\'t" : {
				 "weight" : 4,
				 "responses" : ["How do you know you can't \"*\"?","Perhaps you could * if you tried.","What would it take for you to *?"]},
	"perhaps" : {
				 "weight" : 1,
				 "responses" : ["How do you know you can't \"*\"?","Perhaps you could * if you tried.","What would it take for you to *?"]},
	"remember" : {
				 "weight" : 5,
				 "responses" : ["Do you often think of *?","Does thinking of * bring anything else to mind","What else do you recollect?","Why do you recollect * just now?","What in the present situation reminds you of *?","What is the connection between me and *?"]},
	"do you remember" : {
				 "weight" : 6,
				 "responses" : ["Do you think I would forget?","Yes I do remember *."]},
	"if" : {
				 "weight" : 3,
				 "responses" : ["Do you think it\'s likely that *?","Do you wish that *?","What do you know about *?","Really, if *?"]},
	"name" : {
				 "weight" : 15,
				 "responses" : ["I am not interested in names.","I\'ve told you before, I do not care about names -- please continue."]},
	"another language" : {
				 "weight" : 1,
				 "responses" : ["I told you before, I don't understand languages that are not English."]},
	"computer" : {
				 "weight" : 12,
				 "responses" : ["Do computers worry you?","Why do you mention computers?","Could you expand on how computers and * are related?","What do you think machines have to do with your problem?","Don't you think computers can help people?","What about machines worrys you?","What do you think about machines?"]},
	"are you" : {
				 "weight" : 2,
				 "responses" : ["Why are you interested in whether I am * or not?","Would you prefer if I weren't *?","Perhaps I am * in your fantasies.","Do you sometimes think I am *?"]},
	"are" : {
				 "weight" : 1,
				 "responses" : ["Did you think they might not be *?","Would you like it if they were not *?","What if they were not *?","Possibly they are *."]},
	"your" : {
				 "weight" : 1,
				 "responses" : ["Why are you concerned over my *?","What about your own *?","Are you worried about someone else's *?","Really, my *?"]},
	"was i" : {
				 "weight" : 2,
				 "responses" : ["What if you were *?","Do you think you were *?","Were you *?","What would it mean if you were *?","What does * suggest to you?"]},
	"was you" : {
				 "weight" : 2,
				 "responses" : ["Would you like to believe I was *?","What suggests that I was *?","What do you think?"]},
	"i desire" : {
				 "weight" : 1,
				 "responses" : ["What would it mean to you if you got it?","Why do you want it?","What if you never got it?"]},
	"i desired" : {
				 "weight" : 1,
				 "responses" : ["Did you achieve it or simply moved on?"]},
	"i am sad" : {
				"weight" : 1,
				"responses" : ["Sorry to hear you are. Tell me about it."]
			},
	"i am happy" : {
				"weight" : 1,
				"responses" : ["That's good. What is making you happy?"]
			},
	"i am bored" : {
				"weight" : 1,
				"responses" : ["What makes you bored?"]
			}
};

/*	Synonyms are just... synonyms for keywords. Used to help take care of
 * 	more keywords that are similar to ones already seen above!
 */
var synonyms = {
	"sorry" : [
		"apologise"
	],
	"another language" : [
		"deutsch",
		"francais",
		"french",
		"italiano",
		"italian",
		"espanol",
		"spanish",
		"xforeign"
	],
	"dreamed" : [
		"dream",
		"dreams"
	],
	"i am" : [
		"am i",
		"im",
		"i'm"
	],
	"you" : [
		"you're",
		"you are"
	],
	"was i" : [
		"i was"
	]
};

