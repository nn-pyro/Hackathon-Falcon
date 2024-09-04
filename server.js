const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { spawn } = require('child_process');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/chatbot.html', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'chatbot.html'));
});

app.post('/getAdvice', (req, res) => {
    const { condition, language } = req.body;
    const user_input = `Condition: ${condition}`;

    const processInput = language === 'en' ?
        Promise.resolve(user_input) :
        new Promise((resolve, reject) => {
            const translateProcess = spawn('python', ['translate.py', user_input, 'vi_en']);

            let translated_input = '';
            translateProcess.stdout.on('data', (data) => {
                translated_input += data.toString();
            });

            translateProcess.stderr.on('data', (data) => {
                console.error(`translate.py stderr: ${data}`);
            });

            translateProcess.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error(`translate.py process exited with code ${code}`));
                } else {
                    resolve(translated_input.trim());
                }
            });
        });

    processInput.then(translated_input => {
        const modelProcess = spawn('python', ['model.py', translated_input]);

        let response = '';
        modelProcess.stdout.on('data', (data) => {
            response += data.toString();
        });

        modelProcess.stderr.on('data', (data) => {
            console.error(`model.py stderr: ${data}`);
        });

        modelProcess.on('close', (code) => {
            if (code !== 0) {
                res.status(500).send('An error occurred while processing your request.');
            } else {
                if (language === 'vi') {
                    const translateBackProcess = spawn('python', ['translate.py', response, 'en_vi']);

                    let final_response = '';
                    translateBackProcess.stdout.on('data', (data) => {
                        final_response += data.toString();
                    });

                    translateBackProcess.stderr.on('data', (data) => {
                        console.error(`translate.py stderr: ${data}`);
                    });

                    translateBackProcess.on('close', (code) => {
                        if (code !== 0) {
                            res.status(500).send('An error occurred while processing your request.');
                        } else {
                            res.json({ advice: final_response.trim() });
                        }
                    });
                } else {
                    res.json({ advice: response.trim() });
                }
            }
            
        });
    }).catch(error => {
        console.error(error);
        res.status(500).send('An error occurred while processing your request.');
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
