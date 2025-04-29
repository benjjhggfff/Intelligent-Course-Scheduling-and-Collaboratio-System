<script setup>
import '../../src/assets/base.css'
import { ref } from 'vue'
const formData = ref({
  username: '',
  password: '',
  rememberMe: false
})
const formDataRef = ref(null)
const rules = ref({
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, max: 15, message: '长度在 8到 15 个字符', trigger: 'blur' },
    //至少包含一个数字和一个字母只能使用数字、字母和指定特殊字符长度在8到18个字符之间
    //^(?=.*\\d)(?=.*[a-zA-Z])[\\da-zA-Z~!@#$%^&*_]{8,18}$
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,15}$/,
      message: '密码必须包含大小写字母和数字',
      trigger: 'blur'
    }
  ],
  username: [
    { required: true, message: '昵称不能为空', trigger: 'blur' },
    { min: 1, max: 15, message: '长度在 1到 15 个字符', trigger: 'blur' }
  ]
})
</script>

<template>
  <div class="login-page">
    <div class="header">
      <div class="inner-header flex">
        <div class="login">
          <div class="title">
            <h1>Sign In</h1>
            <p>Sign in to continue to your account</p>
          </div>
          <div class="formBox">
            <el-form
              :model="formData"
              :rules="rules"
              ref="formDataRef"
              class="form"
            >
              <el-form-item prop="username">
                <el-input
                  class="login-input"
                  v-model="formData.username"
                  placeholder="Username"
                ></el-input>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  class="login-input"
                  v-model="formData.password"
                  type="password"
                  show-password
                  placeholder="Password"
                ></el-input>
              </el-form-item>
              <el-form-item style="margin-top: -10px">
                <el-checkbox
                  class="checkbox"
                  style="margin: 0px 170px 0 0"
                  v-model="formData.rememberMe"
                  >记住我</el-checkbox
                >
                <span class="forgetpassword">忘记密码？</span>
              </el-form-item>
              <el-button round style="width: 6.8rem; height: 2.5rem"
                >登&nbsp;&nbsp;&nbsp;录</el-button
              >
            </el-form>
          </div>
        </div>
      </div>

      <div>
        <svg
          class="waves"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shape-rendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g class="parallax">
            <use
              xlink:href="#gentle-wave"
              x="48"
              y="0"
              fill="rgba(255,255,255,0.7)"
            />
            <use
              xlink:href="#gentle-wave"
              x="48"
              y="3"
              fill="rgba(255,255,255,0.5)"
            />
            <use
              xlink:href="#gentle-wave"
              x="48"
              y="5"
              fill="rgba(255,255,255,0.3)"
            />
            <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  margin-top: 6rem;
  width: 25rem;
  height: 30rem;
  border-radius: 20%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center; /* 让子元素在垂直方向上居中 */
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  /* 透明核心代码 */
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.4);
}
.forgetpassword {
  font-size: 10px;
}
.title {
  position: absolute;
  top: 0;
}
.formBox {
  width: 18rem;
  height: 29rem;
  margin-top: 150px;
}
.form {
  width: 100%;
  height: 100%;
  margin-top: 30px;
}
// v-deep
.login-input {
  width: 100%; /* 调整合适的宽度 */
  height: 40px;
  border-radius: 20px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(245, 242, 242, 0.1);
  margin: 0 auto; /* 实现水平居中 */
}
:deep(.el-checkbox__label) {
  font-size: 10px;
  color: #fff;
}
:deep(.el-form-item__content) {
  width: 80%;
}
.header {
  position: relative;
  text-align: center;
  background: linear-gradient(
    60deg,
    rgb(185, 217, 243) 0%,
    rgb(84, 161, 248) 100%
  );
  /* 	background: #FFAFBD;
background: -webkit-linear-gradient(to right, #ffc3a0, #FFAFBD);
background: linear-gradient(to right, #ffc3a0, #FFAFBD);
*/
  color: white;
}

.inner-header {
  height: 75vh;
  width: 100%;
  margin: 0;
  padding: 0;
}

.flex {
  /*Flexbox for containers*/
  display: flex;
  justify-content: center;

  text-align: center;
}

.waves {
  position: relative;
  width: 100%;
  height: 15vh;
  margin-bottom: -7px; /*Fix for safari gap*/
  min-height: 100px;
  max-height: 150px;
}

.parallax > use {
  animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}
.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}
.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}
.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}
.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}
@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}
/*Shrinking for mobile*/
@media (max-width: 768px) {
  .waves {
    height: 40px;
    min-height: 40px;
  }
  .content {
    height: 30vh;
  }
  h1 {
    font-size: 24px;
  }
}
</style>
