const apiKey = process.env.GEMINI_API_KEY;

fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
  .then(res => res.json())
  .then(data => {
    console.log("Available models:");
    data.models.forEach(m => console.log(m.name));
  })
  .catch(console.error);
