document.addEventListener('DOMContentLoaded', () => {
    const chatbotIcon = document.getElementById('chatbot-icon');
    const chatbot = document.getElementById('chatbot');
    const closeChatbot = document.getElementById('close-chatbot');
    const sendMessageBtn = document.getElementById('send-message');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Microphone button for voice input
    const micButton = document.createElement('button');
    micButton.id = 'mic-button';
    micButton.innerHTML = '<i class="fas fa-microphone"></i>';
    document.querySelector('.chatbot-input-container').appendChild(micButton);

    let context = {
        lastTopic: null
    };

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    const synth = window.speechSynthesis;
    let userInfo = getUserInfo();  // Get user's saved info from localStorage
    let emotionState = getEmotionState();  // Get the chatbot's current emotional state

    // Update the chatbot's appearance based on emotion
    updateChatbotAppearance(emotionState);

    chatbotIcon.addEventListener('click', () => {
        chatbot.style.display = 'block';
        if (!userInfo.name) {
            askForName();
        }
    });

    closeChatbot.addEventListener('click', () => {
        chatbot.style.display = 'none';
    });

    sendMessageBtn.addEventListener('click', handleUserInput);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserInput();
        }
    });

    micButton.addEventListener('click', () => {
        recognition.start();
    });

    recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        displayMessage(speechToText, 'user-message');
        const correctedMessage = correctSpelling(speechToText);
        const botResponse = getResponse(correctedMessage);
        displayMessage(botResponse, 'bot-message');
        speakResponse(botResponse);
        adjustEmotionBasedOnMessage(speechToText);  // Adjust emotion based on input
    };

    function handleUserInput() {
        const userMessage = chatbotInput.value.trim();
        if (userMessage === '') return;
    
        displayMessage(userMessage, 'user-message');
        chatbotInput.value = '';
    
        const correctedMessage = correctSpelling(userMessage);
        const botResponse = getResponse(correctedMessage);
        displayMessage(botResponse, 'bot-message', true); // Pass 'true' to mark as bot message
    }

    // Function to display message in chatbot
    function displayMessage(message, className, isBot = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chatbot-message', className);
    
        // If it's a bot message, append the speaker button
        if (isBot) {
            const textWrapper = document.createElement('span');
            textWrapper.textContent = message;
    
            const speakerButton = document.createElement('button');
            speakerButton.innerHTML = '<i class="fas fa-volume-up"></i>';
            speakerButton.classList.add('speaker-button');
            speakerButton.onclick = () => speakResponse(message);
    
            messageElement.appendChild(textWrapper);
            messageElement.appendChild(speakerButton);
        } else {
            messageElement.textContent = message;
        }
    
        chatbotMessages.appendChild(messageElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
    

    // Correct common spelling mistakes with expanded corrections
    function correctSpelling(message) {
        const corrections = {
            'eduaction': 'education',
            'exprience': 'experience',
            'skilz': 'skills',
            'experince': 'experience',
            'favrit': 'favorite',
            'conatct': 'contact',
            'wrokout': 'workout',
            'somthing': 'something'
        };
        return message.split(' ').map(word => corrections[word.toLowerCase()] || word).join(' ');
    }

    // Function to adjust chatbot's emotion based on user input
    function adjustEmotionBasedOnMessage(message) {
        const cheerfulKeywords = ['thank you', 'great', 'amazing', 'awesome', 'happy'];
        const seriousKeywords = ['problem', 'issue', 'sad', 'bad', 'unhappy', 'angry'];

        // Detect emotion based on user input
        if (cheerfulKeywords.some(word => message.toLowerCase().includes(word))) {
            emotionState = 'cheerful';
        } else if (seriousKeywords.some(word => message.toLowerCase().includes(word))) {
            emotionState = 'serious';
        } else {
            emotionState = 'neutral';
        }

        saveEmotionState(emotionState);
        updateChatbotAppearance(emotionState);
    }

    // Update the chatbot's avatar or appearance based on emotion
    function updateChatbotAppearance(emotion) {
        const chatbotHeader = document.querySelector('.chatbot-header');

        if (emotion === 'cheerful') {
            chatbotHeader.style.backgroundColor = '#FFD700';  // Cheerful: Bright yellow
            chatbotHeader.querySelector('h4').textContent = "Ahmad's AI (Cheerful)";
        } else if (emotion === 'serious') {
            chatbotHeader.style.backgroundColor = '#FF6347';  // Serious: Red
            chatbotHeader.querySelector('h4').textContent = "Ahmad's AI (Serious)";
        } else {
            chatbotHeader.style.backgroundColor = '#3B82F6';  // Neutral: Default blue
            chatbotHeader.querySelector('h4').textContent = "Ahmad's AI Assistant";
        }
    }

    // Save and retrieve emotional state from localStorage
    function saveEmotionState(emotion) {
        localStorage.setItem('chatbotEmotion', emotion);
    }

    function getEmotionState() {
        return localStorage.getItem('chatbotEmotion') || 'neutral';
    }

    // Ask for the user's name if not provided
    function askForName() {
        setTimeout(() => {
            displayMessage('Hello! May I know your name?', 'bot-message');
        }, 500);
    }

    // Save user information and preferences
    function saveUserInfo(name) {
        userInfo.name = name;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }

    function saveUserPreference(key, value) {
        userInfo[key] = value;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
    }

    function getUserInfo() {
        return JSON.parse(localStorage.getItem('userInfo')) || {};
    }

    // Generate a response based on the user's message and context
    function getResponse(message) {
        message = message.toLowerCase();
        let detectedTopic = detectTopic(message);
        context.lastTopic = detectedTopic;

        if (message.includes('what is my name')) {
            return `Your name is ${userInfo.name}.`;
        }

        // Handle preference setting (ask about favorite topics)
        if (message.includes('my name is')) {
            const name = message.replace('my name is', '').trim();
            saveUserInfo(name);
            return `Nice to meet you, ${name}!`;
        }

        if (message.includes('my favorite topic is')) {
            const topic = message.replace('my favorite topic is', '').trim();
            saveUserPreference('favoriteTopic', topic);
            return `Got it! I'll remember that your favorite topic is ${topic}.`;
        }

        // New Personal Information Responses
        if (message.includes('who is ahmad')) {
            return "Ahmad is 20 years old, born in Erbil, Iraq, and studying Computer Education at Tishk International University.";
        }

        if (message.includes('when is ahmad born')) {
            return "Ahmad was born on November 17, 2003, in Erbil.";
        }

        if (message.includes('how many countries has ahmad been to')) {
            return "Ahmad has been to Turkey and Germany.";
        }

        if (message.includes('where is ahmad from')) {
            return "Ahmad is from Iraq and is Kurdish.";
        }

        if (message.includes('what is ahmad\'s nationality')) {
            return "Ahmad is Kurdish.";
        }

        if (message.includes('how old is ahmad')) {
            return "Ahmad is 20 years old, born on November 17, 2003.";
        }

        if (message.includes('what is ahmad studying')) {
            return "Ahmad is studying Computer Education at Tishk International University and is currently in his third grade.";
        }

        return generateResponse(detectedTopic, message);
    }

    // Detect the topic based on keywords in the message
    function detectTopic(message) {
        const topics = {
            education: ['education', 'degree', 'school', 'university', 'study'],
            skills: ['skills', 'abilities', 'proficiencies', 'expertise'],
            projects: ['projects', 'work', 'applications', 'systems'],
            experience: ['experience', 'background', 'jobs', 'roles'],
            dailyRoutine: ['daily routine', 'routine', 'day', 'schedule'],
            workout: ['workout', 'exercise', 'fitness'],
            weekend: ['weekend', 'saturday', 'sunday'],
            greetings: ['hello', 'hi', 'hey'],
            contact: ['contact', 'reach', 'email', 'linkedin'],
            joke: ['joke', 'funny'],
            favoriteSong: ['favorite song', 'song', 'music'],
            favoriteColor: ['favorite color', 'color'],
            whatsUp: ["what's up", "how's it going"]
        };

        for (const [key, keywords] of Object.entries(topics)) {
            for (const keyword of keywords) {
                if (message.includes(keyword)) {
                    return key;
                }
            }
        }
        return null;
    }

    // Generate a response based on the detected intent/topic and time of day
    function generateResponse(intent, message) {
        const currentTime = new Date().getHours();
        let timeGreeting;

        if (currentTime >= 5 && currentTime < 12) {
            timeGreeting = 'Good morning!';
        } else if (currentTime >= 12 && currentTime < 18) {
            timeGreeting = 'Good afternoon!';
        } else {
            timeGreeting = 'Good evening!';
        }

        const responses = {
            education: getRandomResponse([
                'Ahmad completed his degree at Tishk International University in the Computer Education department.',
                'Ahmad has a degree from Tishk International University in Computer Education.',
                'Ahmad studied at Tishk International University, focusing on Computer Education.'
            ]),
            skills: getRandomResponse([
                'Ahmad has strong skills in Web Development, AI Development, and Mobile App Development.',
                'Ahmad is skilled in web, AI, and mobile app development.',
                'Ahmad excels at AI development, web technologies, and mobile apps.'
            ]),
            projects: getRandomResponse([
                'Ahmad has worked on various projects like the Face Detection Attendance System and Sign Language to Text Converter.',
                'Ahmad completed impressive projects, including a face detection system and a sign language converter.',
                'Ahmad’s notable projects include a Face Detection Attendance System and a Sign Language to Text Converter.'
            ]),
            experience: getRandomResponse([
                'Ahmad has experience working as a Frontend Developer at Soft 4 U Company and interned at Pirmam Company.',
                'Ahmad worked as a Frontend Developer at Soft 4 U and interned at Pirmam Company.',
                'Ahmad gained experience as a Frontend Developer at Soft 4 U and an internship at Pirmam Company.'
            ]),
            dailyRoutine: getRandomResponse([
                'Ahmad starts his day with coding and spends time learning new technologies in the evening.',
                'Ahmad’s day begins with coding and ends with learning about the latest technologies.',
                'In the morning, Ahmad focuses on coding, and later in the day, he dives into learning new tech skills.'
            ]),
            workout: getRandomResponse([
                'Ahmad works out in the afternoon to stay energized.',
                'Ahmad enjoys working out in the afternoon to keep himself active and focused.',
                'In the afternoon, Ahmad likes to work out to maintain his energy levels.'
            ]),
            weekend: getRandomResponse([
                'On weekends, Ahmad enjoys time with family and learning new things.',
                'Ahmad spends his weekends with family and exploring new knowledge.',
                'Weekends for Ahmad are all about family time and picking up new skills.'
            ]),
            greetings: `${timeGreeting} How can I assist you today?`,
            contact: 'You can reach Ahmad via email at ahmadshwanaswad@gmail.com or through LinkedIn at Ahmad Shwan\'s profile.',
            joke: getRandomResponse([
                'Why do programmers prefer dark mode? Because the light attracts bugs!',
                'Why don’t programmers like nature? It has too many bugs!',
                'How many programmers does it take to change a lightbulb? None, it’s a hardware problem!'
            ]),
            favoriteSong: 'Ahmad’s favorite song is "Chawakant" by Adnan Karim.',
            favoriteColor: 'Ahmad loves the colors indigo and sky blue.',
            whatsUp: `${timeGreeting} Ready for another day of coding?`
        };

        return responses[intent] || "I'm not sure about that. You can ask me about Ahmad's education, skills, or projects!";
    }

    // Get random response from an array of options
    function getRandomResponse(responsesArray) {
        return responsesArray[Math.floor(Math.random() * responsesArray.length)];
    }

    // Make the bot speak its response
    function speakResponse(response) {
        const utterance = new SpeechSynthesisUtterance(response);
        utterance.voice = synth.getVoices().find(voice => voice.name === 'Google UK English Male') || synth.getVoices()[0];
        synth.speak(utterance);
    }

    // Save interaction history to localStorage
    function saveUserInteraction(message) {
        const interactionHistory = JSON.parse(localStorage.getItem('interactionHistory')) || [];
        interactionHistory.push({ message, timestamp: new Date() });
        localStorage.setItem('interactionHistory', JSON.stringify(interactionHistory));
    }

    // Get interaction history
    function getUserInteractionHistory() {
        return JSON.parse(localStorage.getItem('interactionHistory')) || [];
    }
});
