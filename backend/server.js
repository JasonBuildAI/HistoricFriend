const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 4000;

const DEEPSEEK_API_KEY = 'sk-e7b5c2f42dc6472bb78327cacd0bde6a';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

const UPLOAD_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getFiles() {
  if (!fs.existsSync(UPLOAD_DIR)) return [];
  
  const files = fs.readdirSync(UPLOAD_DIR);
  return files.map(filename => {
    const filePath = path.join(UPLOAD_DIR, filename);
    const stats = fs.statSync(filePath);
    return {
      id: filename,
      name: filename.substring(filename.indexOf('-') + 1),
      filename: filename,
      size: stats.size,
      sizeFormatted: formatFileSize(stats.size),
      uploadDate: stats.birthtime,
      uploadDateFormatted: new Date(stats.birthtime).toLocaleString('zh-CN')
    };
  }).sort((a, b) => b.uploadDate - a.uploadDate);
}

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '请选择要上传的文件' });
  }
  res.json({
    message: '文件上传成功',
    file: {
      id: req.file.filename,
      name: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      sizeFormatted: formatFileSize(req.file.size)
    }
  });
});

app.get('/api/files', (req, res) => {
  const files = getFiles();
  res.json({ files, total: files.length });
});

app.delete('/api/files/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(UPLOAD_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: '文件不存在' });
  }
  
  fs.unlinkSync(filePath);
  res.json({ message: '文件删除成功' });
});

app.get('/api/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(UPLOAD_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: '文件不存在' });
  }
  
  const originalName = filename.substring(filename.indexOf('-') + 1);
  res.download(filePath, originalName);
});

app.post('/api/generate-moments', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: '请提供历史人物名字' });
    }

    const systemPrompt = `你是一个历史人物朋友圈生成器。请为指定的历史人物生成一条真实的朋友圈动态。

请按照以下JSON格式返回结果，不要包含任何markdown标记：
{
  "name": "人物名字",
  "avatar": "emoji头像（选择一个适合该人物的emoji）",
  "content": "朋友圈内容（2-5句话，符合人物性格和时代背景，用第一人称）",
  "images": ["图片描述1", "图片描述2", ...], // 0-3张图片描述，用文字描述可能的图片内容
  "likes": ["好友1", "好友2", ...], // 2-8个点赞的好友，应该是该历史人物同时代或相关的人物
  "comments": [
    {"user": "评论者名字", "text": "评论内容"},
    ...
  ] // 1-5条评论，评论者应该是该历史人物同时代或相关的人物，评论要符合人物身份和关系
}

请确保返回的是纯粹的JSON，不要有任何其他文字说明。`;

    const userPrompt = `请为历史人物"${name}"生成一条朋友圈动态。`;

    const response = await axios.post(DEEPSEEK_API_URL, {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 1000
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      }
    });

    const aiResponse = response.data.choices[0].message.content;
    
    let momentsData;
    try {
      momentsData = JSON.parse(aiResponse);
    } catch (parseError) {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        momentsData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('无法解析AI返回的JSON数据');
      }
    }

    res.json({ success: true, data: momentsData });
  } catch (error) {
    console.error('生成朋友圈失败:', error.response?.data || error.message);
    res.status(500).json({ 
      error: '生成朋友圈失败', 
      details: error.response?.data || error.message 
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '历史人物朋友圈生成器服务正常运行' });
});

app.listen(PORT, () => {
  console.log('🚀 历史人物朋友圈生成器后端服务已启动: http://localhost:' + PORT);
  console.log('📚 API 文档:');
  console.log('   - 健康检查: http://localhost:' + PORT + '/api/health');
  console.log('   - 生成朋友圈: POST http://localhost:' + PORT + '/api/generate-moments');
  console.log('   - 上传文件: POST http://localhost:' + PORT + '/api/upload');
  console.log('   - 文件列表: GET http://localhost:' + PORT + '/api/files');
  console.log('   - 下载文件: GET http://localhost:' + PORT + '/api/download/:filename');
  console.log('   - 删除文件: DELETE http://localhost:' + PORT + '/api/files/:filename');
  console.log('📁 上传目录:', UPLOAD_DIR);
});
