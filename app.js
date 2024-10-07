const video = document.getElementById('interviewVideo');
const questionContent = document.getElementById('questionContent');
const nextQuestionBtn = document.getElementById('nextQuestion');
const submitBtn = document.getElementById('submitBtn');

let mediaRecorder;
let recordedChunks = [];

// Predefined set of interview questions
const interviewQuestions = [
  "Tell me about yourself.",
  "Why do you want this job?",
  "What are your greatest strengths?",
  "Where do you see yourself in 5 years?"
];
let currentQuestionIndex = 0;

questionContent.textContent = interviewQuestions[currentQuestionIndex];

// Capture video stream from webcam
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  .then(stream => {
    video.srcObject = stream;
    mediaRecorder = new MediaRecorder(stream);

    // Automatically start recording when the video is initialized
    mediaRecorder.start();
    console.log("Recording started automatically...");

    mediaRecorder.ondataavailable = event => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const videoURL = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = videoURL;
      downloadLink.download = 'interviewRecording.webm';
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Redirect to the new page after stopping the recording
      window.location.href = "thank.html";  // Replace with your desired URL
    };
  })
  .catch(error => console.error('Error accessing media devices.', error));

// Switch to the next interview question
nextQuestionBtn.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < interviewQuestions.length) {
    questionContent.textContent = interviewQuestions[currentQuestionIndex];
  } else {
    // End of questions, show the Submit button
    questionContent.textContent = "End of interview.";
    nextQuestionBtn.style.display = 'none';
    submitBtn.style.display = 'block';
  }
});

// Stop recording and redirect to a new page when "Submit" button is clicked
submitBtn.addEventListener('click', () => {
  mediaRecorder.stop();
  console.log("Recording stopped and submitting...");
});
