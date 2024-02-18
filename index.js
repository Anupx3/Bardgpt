const express = require('express');
const axios = require('axios');
const googleIt = require('google-it');
const AI = require("stable-diffusion-cjs");
const fs = require('fs');
const os = require("os")
const path = require("path")
const { youtube } = require('scrape-youtube');
const { lyrics,artinama,googleImage,gempaNow,tiktokdl,savefrom,instagramdl,jadwalTVNow,jadwalTV } = require('@bochilteam/scraper');
const textpro = require('@neeraj-x0/textpro')
const simsimi = require('simsimi-api');
var gtts = require('node-gtts')('id');
const ytdl = require('ytdl-core');
const all = require('scrape');
const app = express();
app.use(express.json());
//apnya
app.get("/sdf", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    res.status(400).json({ error: "Missing 'q' parameter in the query string." });
    return;
  }

  AI.generate(query, async (result) => {
    if (result.error) {
      console.log(result.error);
      res.status(500).json({ error: "Failed to generate image." });
      return;
    }
    try {
      const imageData = result.results[0].split(",")[1];
      const buffer = Buffer.from(imageData, "base64");
      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": buffer.length,
      });
      res.end(buffer);
      console.log('stable deffusion')
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Failed to process image." });
    }
  });
});
app.get('/sindiraku', (req, res) => {
  const { insults } = require('./sindir.js')
  const randomInsult = insults[Math.floor(Math.random() * insults.length)];
  const data = {
    "author": "Anup Api",
    "respon": randomInsult,
  };
  const jsonData = JSON.stringify(data, null, 2);
  res.setHeader('Content-Type', 'application/json');
  res.send(jsonData);
  console.log('sindir aku')
});
app.get('/play', async (req, res) => {
  try {
    const text = req.query.text; // Mengambil query parameter "text"
    const searchResult = await youtube.search(text);
    if (!searchResult || searchResult.videos.length === 0) {
      throw new Error('Video tidak ditemukan');
    }

    const video = searchResult.videos[0].link;
    const info = searchResult.videos[0]
    const ini = 'https://aliya-2.0xanupx0.repl.co/youtube?url='+video

    const inu = 'https://aliya-2.0xanupx0.repl.co/ytmp4?url='+video

const data = ({creator : "Anup-Api",info, mp3 : ini , mp4 : inu })
    const jsonData = JSON.stringify(data, null, 2);
  res.setHeader('Content-Type', 'application/json');
  res.send(jsonData);
    console.log('play')
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
app.get('/ytmp4', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is missing.' });
    }

    const videoInfo = await ytdl.getInfo(url);
    const videoTitle = videoInfo.videoDetails.title;
    const dl_url = await ytdl(url, { quality: 'lowest' });

    // Set the response headers to force download the video with the desired name
    console.log('ytmp4')
    res.setHeader('Content-Disposition', `attachment; filename="anup.mp4"`);
    res.setHeader('Content-Type', 'video/mp4');

    // Pipe the video stream to the response
    dl_url.pipe(res);

    // You can also save the video to the server by uncommenting the following lines:
    // const outputPath = 'path/to/save/video/by-azzapi.mp4';
    // dl_url.pipe(fs.createWriteStream(outputPath));
    // res.json({ message: 'Video download completed.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});


app.get('/ytmp3', async (req, res) => {
  try {
    const videoUrl = req.query.url;
    if (!videoUrl || !ytdl.validateURL(videoUrl)) {
      return res.status(400).json({ error: 'Invalid YouTube video URL provided.' });
    }

    const audioPath = path.join(__dirname, 'audio.mp3');

    // Download the audio stream
    const audioStream = ytdl(videoUrl, { quality: 'highestaudio' });

    // Save the audio stream to a file
    audioStream.pipe(fs.createWriteStream(audioPath));

    audioStream.on('end', () => {
      // Send the audio file as a response once the download is complete
      console.log('ytmp3')
      res.download(audioPath, 'by Anup Api.mp3', (err) => {
        // Remove the downloaded audio file after sending the response
        fs.unlinkSync(audioPath);
      });
    });
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});
app.get('/gpt', async (req, res) => {
  const q = req.query.q
  try {
    const query = q;
const result = await all.gpt(query);
const data = {author : "Anup-Api", status : "200", respon : result};
    const jsonData = JSON.stringify(data, null, 2);
  res.setHeader('Content-Type', 'application/json');
  res.send(jsonData);
    console.log('chatgpt')
  } catch (error) {
    res.send(error)
  }
})
app.get('/qr', async (req, res) => {
  const { text } = req.query;
  const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(text)}`;

  try {
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    const qrCodeImage = Buffer.from(response.data, 'binary');

    res.set('Content-Type', 'image/png');
    res.send(qrCodeImage);
    console.log('text To qr')
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating QR Code');
  }
});
app.get('/jadwaltv/:query', async(req, res)=>{
const ch = req.params.query
try {
  const data = await jadwalTV(ch)
  const jsonData = JSON.stringify(data, null, 2);
  res.setHeader('Content-Type', 'application/json');
  res.send(jsonData);
  console.log('Jadwal Tv')
} catch (error) {
  res.send(error)
}
})
app.get('/jadwal-tv', async(req, res)=>{
  try {
    const data = await jadwalTVNow()
    const jsonData = JSON.stringify(data, null, 2);
  res.setHeader('Content-Type', 'application/json');
  res.send(jsonData);
    console.log('Jadwal Tv')
  } catch (error) {
    res.json(error)
  }
})

app.get('/tts', function(req, res) {
  res.set({'Content-Type': 'audio/mpeg'});
  gtts.stream(req.query.text).pipe(res);
  console.log('Tts')
})
app.get('/yts', async (req, res) => {
  try {
    const text = req.query.text; // Mengambil query parameter "text"
    const searchResult = await youtube.search(text);
    if (!searchResult || searchResult.videos.length === 0) {
      throw new Error('Video tidak ditemukan');
    }

    const video = searchResult.videos;
    
const data = ({creator : "Anup-Api",hasil : video})
    const jsonData = JSON.stringify(data, null, 2);
  res.setHeader('Content-Type', 'application/json');
  res.send(jsonData);
    console.log('yts')
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});
  
app.get('/ig', (req, res) => {
  const url = req.query.url; // Mendapatkan nilai parameter url dari query string

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  instagramdl(url)
    .then((result) => {
      const data = result;
      const jsonData = JSON.stringify(data, null, 2);
  res.setHeader('Content-Type', 'application/json');
  res.send(jsonData);
      console.log('ig')
    })
    .catch((error) => {
      res.status(500).json({ error: 'An error occurred' });
    });
});
app.get('/savefrom', async (req, res) => {
  try {
    const url = req.query.url; // Ambil URL dari parameter query

    // Panggil fungsi savefrom dengan URL yang diberikan
    const result = await savefrom(url);

    const data = ({creator : "Anup Api",
                 Status : "200",hasil : result}); 
const jsonData = JSON.stringify(data, null, 2);
  res.setHeader('Content-Type', 'application/json');
  res.send(jsonData);
    console.log('save from')
  } catch (error) {
    res.status(500).json({ error: error.message }); // Tangani error jika terjadi
  }
});

app.get('/tiktok', async (req, res) => {
  const q = req.query.url
  try {
    const data = await tiktokdl(q);
    const jsonData = JSON.stringify(data, null, 2);
  res.setHeader('Content-Type', 'application/json');
  res.send(jsonData);
    console.log('tiktok')
  } catch (error) {
    res.status(500).json({ error: 'Gagal mendapatkan data.' });
  }
});
app.get('/gempa', async (req, res) => {
  try {
    const data = await gempaNow();
    const jsonData = JSON.stringify(data[0], null, 2);
  res.setHeader('Content-Type', 'application/json');
  res.send(jsonData);
    console.log('gempa')
  } catch (error) {
    res.status(500).json({ error: 'Gagal mendapatkan data gempa.' });
  }
});
app.get('/textpro/:text/:efek', async (req, res) => {
  try {
    const query = req.params.text;
    const efek = req.params.efek
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is missing' });
    }
    const results = await textpro[efek](query)


    const response = await axios.get(results.url, {
      responseType: 'arraybuffer'
    });
    const tempImagePath = path.join(__dirname, 'temp', 'gambar.jpg');
    fs.writeFileSync(tempImagePath, response.data);
  res.sendFile(tempImagePath);
    console.log('text pro ')
  } catch (error) {
    console.error(error);
    res.status(500).json({Error : "internal server error"});
  }
});
app.get('/img', async (req, res) => {
  const query = req.query.q;
  
  try {
    const images = await googleImage(query);
    const randomNum = Math.floor(Math.random() * 10) + 1;
    const data = {author : "Anup Api",hasil : images[randomNum]}
    const jsonData = JSON.stringify(data, null, 2);
  res.setHeader('Content-Type', 'application/json');
  res.send(jsonData);
    console.log('image')
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
app.get('/artinama/:nama', async (req, res) => {
  const { nama } = req.params;

  try {
    const hasil = await artinama(nama);
    const data = { author : "Anup-Api",nama, arti: hasil };
    const jsonData = JSON.stringify(data, null, 2);
  res.setHeader('Content-Type', 'application/json');
  res.send(jsonData);
    console.log('artinama')
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan saat mencari arti nama.' });
  }
});

app.get('/simsimi', (req, res) => {
  const message = req.query.m || 'hi';
  const language = req.query.l || 'id';

  simsimi.simtalk(message, language)
    .then((response) => {
      const riki = response.message
      console.log(riki);
      const data = {author : "Anup Api",respone : riki}
      const jsonData = JSON.stringify(data, null, 2);
  res.setHeader('Content-Type', 'application/json');
  res.send(jsonData);
      console.log('sim simi')
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

  
app.get('/lirik/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const lyricsData = await lyrics(query); 
    const data = {author: lyricsData.author,
  link: lyricsData.link,
  lyrics: lyricsData.lyrics,
  title: lyricsData.title}
    const jsonData = JSON.stringify(data, null, 2);
  res.setHeader('Content-Type', 'application/json');
  res.send(jsonData);


    
  } catch (error) 
{res.status(500).json({ error: 'Failed to fetch lyrics' });
  }
});

app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, 'load.html'));
});

app.get('/index', (req, res) => {
res.sendFile(path.join(__dirname, 'index.html'));
});
app.get('/intro', (req, res) => {
res.sendFile(path.join(__dirname, 'mr.html'));
});

app.get('/monit', (req, res) => {
  const uptime = os.uptime();
  res.send(`Uptime: ${uptime} seconds`);
});

app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs.html'));
});
app.get('/ajojing', (req, res) => {
  res.sendFile(path.join(__dirname, 'laku.mp4'));
})
app.get('/mylagu1', (req, res) => {
  res.sendFile(path.join(__dirname, 'BotikaTTS.mp3'));
})
app.get('/mylagu', (req, res) => {
  res.sendFile(path.join(__dirname, 'lagy.mp3'));
})
app.get('/txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'textpro.html'));
});



//ai
app.get('/ai/:query', async (req, res) => {
  console.log(req.params.query);
  try {
    const sender = Date.now();
    const text = req.params.query;

    // Melakukan pencarian Google
    const searchResults = await googleIt({ 'query': text, 'limit': 10 });
    const articles = searchResults.map(result => ({
      snippet: result.snippet
    }));

    const payload = {
      app: {
        id: "blaael9y3cu1684390361270",
        time: Date.now(),
        data: {
          sender: {
            id: sender + "AnupBot beta"
          },
          message: [
            {
              id: Date.now(),
              time: Date.now(),
              type: "text",
              value: `{
  "System AI": {
    "Knowledge AI": "${JSON.stringify(articles, null, 2)}",
    "Cara Menjawab": "I will respond in a professional manner and use my knowledge with care. I'll provide in-depth explanations and answer your questions in a way that complies with formal standards. In addition, I will present the answer in the form of a minimum of three informative and structured paragraphs."
  },
  "Question": "${text}"
}
`
            }
          ]
        }
      }
    };

    const webhookUrl = 'https://webhook.botika.online/webhook/';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer fbe3d5e1-00a8-4328-8482-53a09a2433e2'
    };

    const webhookResponse = await axios.post(webhookUrl, payload, { headers });
    const { data, status } = webhookResponse;

    if (status === 200) {
      const messages = data.app.data.message;

      if (Array.isArray(messages)) {
        const responseMessages = messages.map((message) => message.value);
        let replyMessage = responseMessages.join('\n');

        if (/(<BR>|<br>)/i.test(replyMessage)) {
          let newReplyMessage = replyMessage.replace(/<BR>|<br>/gi, '\n');
          newReplyMessage = newReplyMessage.replace(/```/g, '\n');
          let replyMessages = newReplyMessage.split('\n');
          let combinedResponse = '';

          for (const [index, message] of replyMessages.entries()) {
            combinedResponse += "\n " + message + '\n';
          }

          res.send(combinedResponse);
        } else {
          res.send(replyMessage);
        }
      } else {
        res.send("iya ada yang bisa azzbot bantu");
      }
    } else {
      res.send("server down");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error");
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
