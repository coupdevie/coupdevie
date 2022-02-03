 const URL = "https://teachablemachine.withgoogle.com/models/loU1f4w0G/";
    let model, webcam, ctx, labelContainer, maxPredictions;

    async function init() {
      if (document.getElementById('startbutton').textContent == 'start'){
          const modelURL = URL + "model.json"
          const metadataURL = URL + "metadata.json"
          model = await tmPose.load(modelURL, metadataURL)
          maxPredictions = model.getTotalClasses()
          const size = 250
          const flip = true
          webcam = new tmPose.Webcam(size, size, flip)
          await webcam.setup()
          await webcam.play()
          window.requestAnimationFrame(loop)
          const canvas = document.getElementById("canvas")
          canvas.width = size; canvas.height = size
          ctx = canvas.getContext("2d")
          labelContainer = document.getElementById("label-container")
          for (let i = 0; i < maxPredictions; i++) { 
              labelContainer.appendChild(document.createElement("div"))
          }
          generateQuote();
          
      }

      async function loop(timestamp) {
          webcam.update(); 
          await predict();
          window.requestAnimationFrame(loop);
      }

      async function predict() {
          const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
          const prediction = await model.predict(posenetOutput);
          for (let i = 0; i < maxPredictions; i++) {
              const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
              labelContainer.childNodes[i].innerHTML = classPrediction;
          }
          drawPose(pose);
          if (prediction[0].probability.toFixed(2) > 0.60) {
            document.getElementById("posturepic").src = "img/goodposture.png";
          }
          else{
            document.getElementById("posturepic").src = "img/badposture.png";
          }
      }
      function drawPose(pose) {
          if (webcam.canvas) {
              ctx.drawImage(webcam.canvas, 0, 0);
          }
      }
      generateImage();
      generateVideo();
    }
    var quotegen = '';
    function generateQuote() {
      var quote = [ 'I AM IN THE RIGHT PLACE AT THE RIGHT TIME, DOING THE RIGHT THING', 'CONSCIOUS BREATHING IS MY ANCHOR', 'I AM LOVED FOR BEING WHO I AM', 'I HAVE THE CHANCE TO LOVE & BE LOVED NO MATTER WHERE I AM', 'I WILL GRASP EVERY OPPORTUNITY AND WATCH MY REALITY RE-ARRANGE ITSELF','I AM HERE TO PUT A DENT IN THE UNIVERSE', 'MY MOST VALUABLE GIFT TO OTHERS IS MY TIME', 'I WILL OPEN MY HEART & DRINK IN THIS GLORIOUS DAY', 'I AM GOOD ENOUGH', 'I MAKE DELIBERATE DECISIONS', 'I AM AFRAID OF NOTHING', "MY LIFE IS ABOUT TO BE INCREDIBLE", 'MY OPINION & PERSPECTIVE IS UNIQUE. IT\'S IMPORTANT & IT COUNTS.', 'EVERYDAY IS A GOOD DAY', 'I DO THINGS I THINK I CANNOT DO', 'I SAY YES TO DECISION THAT SUPPORT MY SELF-VALUE AND SELF-WORTH', 'I AM THE GREATEST. I SAID THAT EVEN BEFORE I KNEW I WAS.' ]
      quotegen = quote[Math.floor(Math.random() * quote.length)]; 
      document.getElementById('quote').innerHTML = `repeat this affiramtion: ${quotegen}`;
      return(quotegen)
    }
      window.addEventListener("DOMContentLoaded", () => {
        const startbutton = document.getElementById('startbutton'); //start button
        const result = document.getElementById('speechoutput'); //output of speechtext
        const main = document.getElementsByTagName('main')[0];
        let listening = false;
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        if (typeof SpeechRecognition !== 'undefined') {
          const recognition = new SpeechRecognition();

          function stop() {
            main.classList.remove('speaking');
            recognition.stop();
            startbutton.textContent = 'start';
          };

          function start() {
            main.classList.add('speaking');
            recognition.start();
            startbutton.textContent = 'stop';
          };

          const appendSpeech = event => {
            result.innerHTML = ""; //div ref to html
            for (const i of event.results) {
              const text = document.createTextNode(i[0].transcript); //text = speaking
              const p = document.createElement('p'); //creates para + inputs text speech into here through apprend to div
              p.id = 'speechResult'
              if (i.isFinal) {
                p.classList.add('final');
              }
              p.appendChild(text);
              result.appendChild(p);

            }
          };
          recognition.continuous = true; //is it cont or not - stops after first click
          recognition.interimResults = true; //lags one step if false
          recognition.addEventListener("result", appendSpeech) // if something has been said, adds to html
          startbutton.addEventListener("click", event => {
            listening ? stop() : start(); //if listening = true then output stop on button, or output start
            listening = !listening; //when button clicked switch value of listening
          });
        } else {
          startbutton.remove(); //removes stop/start button
          const errormsg = document.getElementById('error'); //shows error message it's not working
          errormsg.removeAttribute('hidden');
          errormsg.setAttribute('aria-hidden', 'false');
        }
      });

