<template>
  <div class="app-container">
    <header class="header">
      <h1>🌍 历史人物朋友圈</h1>
      <p>穿越时空，看看古人的朋友圈</p>
    </header>

    <div class="input-section">
      <div class="input-wrapper">
        <input 
          v-model="historicalName" 
          type="text" 
          placeholder="输入历史人物名字，如：李白、苏轼、孔子..."
          @keyup.enter="generateMoments"
          class="name-input"
        />
        <button 
          @click="generateMoments" 
          :disabled="loading"
          class="generate-btn"
        >
          {{ loading ? '生成中...' : '生成朋友圈' }}
        </button>
      </div>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-if="momentsData" class="moments-container">
      <div class="moments-card">
        <div class="user-info">
          <div class="avatar">{{ momentsData.avatar }}</div>
          <div class="user-details">
            <h2 class="username">{{ momentsData.name }}</h2>
            <p class="time">{{ currentTime }}</p>
          </div>
        </div>

        <div class="content">
          <p>{{ momentsData.content }}</p>
        </div>

        <div v-if="momentsData.images && momentsData.images.length > 0" class="images-grid">
          <div 
            v-for="(img, index) in momentsData.images" 
            :key="index"
            class="image-item"
          >
            <div class="image-placeholder">
              <span class="image-emoji">🖼️</span>
              <p class="image-desc">{{ img }}</p>
            </div>
          </div>
        </div>

        <div class="interactions">
          <div class="interaction-btn like-btn" @click="toggleLike">
            <span>{{ liked ? '❤️' : '🤍' }}</span>
            <span>点赞</span>
          </div>
          <div class="interaction-btn comment-btn">
            <span>💬</span>
            <span>评论</span>
          </div>
          <div class="interaction-btn share-btn">
            <span>🔗</span>
            <span>分享</span>
          </div>
        </div>

        <div v-if="momentsData.likes && momentsData.likes.length > 0" class="likes-section">
          <span class="likes-icon">❤️</span>
          <span class="likes-text">{{ momentsData.likes.join('、') }}</span>
          <span v-if="liked" class="you-liked">、你</span>
        </div>

        <div v-if="momentsData.comments && momentsData.comments.length > 0" class="comments-section">
          <div v-for="(comment, index) in momentsData.comments" :key="index" class="comment-item">
            <span class="comment-user">{{ comment.user }}:</span>
            <span class="comment-text">{{ comment.text }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!momentsData && !loading" class="empty-state">
      <div class="empty-icon">📜</div>
      <h3>还没有朋友圈</h3>
      <p>输入历史人物名字，开始穿越之旅吧！</p>
      <div class="suggestions">
        <p class="suggestion-label">试试这些人物：</p>
        <div class="suggestion-tags">
          <span v-for="name in suggestedNames" :key="name" @click="selectName(name)" class="tag">
            {{ name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const historicalName = ref('')
const momentsData = ref(null)
const loading = ref(false)
const error = ref('')
const liked = ref(false)

const suggestedNames = ['李白', '苏轼', '孔子', '秦始皇', '武则天', '诸葛亮', '曹操', '杜甫']

const currentTime = new Date().toLocaleString('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})

const generateMoments = async () => {
  if (!historicalName.value.trim()) {
    error.value = '请输入历史人物名字'
    return
  }

  error.value = ''
  loading.value = true
  liked.value = false

  try {
    const response = await axios.post('/api/generate-moments', {
      name: historicalName.value
    })
    
    momentsData.value = response.data.data
  } catch (err) {
    error.value = err.response?.data?.error || '生成失败，请重试'
    console.error('生成朋友圈失败:', err)
  } finally {
    loading.value = false
  }
}

const toggleLike = () => {
  liked.value = !liked.value
}

const selectName = (name) => {
  historicalName.value = name
  generateMoments()
}
</script>
