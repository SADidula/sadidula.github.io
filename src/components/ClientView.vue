<template>
  <div class="d-flex vh-100">
    <!-- Welcome Popup Overlay -->
    <transition name="fade">
      <div v-if="showWelcome" class="welcome-overlay p-lg-5 p-2" style="overflow: scroll;">
        <div class="welcome-popup p-lg-5 p-3">
          <div class="col-12 col-lg-10 mx-auto text-left">
            <div class="row text-center">
              <h2 class="pb-4 fw-bold">I craft scalable systems and immersive experiences with
                the same precision and passion.</h2>
            </div>
            <div class="row">
              <p>
                I'm <span class="fw-bolder">Didula S.A.</span> — a full-stack developer, game engineer, and creative
                technologist.
                This portfolio is a curated gallery of the work I’ve built across enterprise systems, experimental
                personal tools,
                and hyper-casual mobile games.
              </p>
            </div>
            <div class="row d-none d-lg-block">
              <p>
                Whether you're here to explore robust backend architecture, clean front-end interfaces, or the
                fast-paced world of game development —
                you're in the right place.
              </p>
            </div>
            <div class="row">
              <p>
                Dive into the columns to explore each domain. Everything here is built by me, from code to concept. You
                are most welcome to contact me.
              </p>
            </div>
            <div class="row">
              <LinksView />
            </div>
            <div class="row">
              <div class="col-12 col-lg-4 mx-auto">
                <button class="w-100 btn btn-secondary-cs mt-3 fw-bold" @click="showWelcome = false">Let Us Get
                  Started!</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div class="row p-0 m-0 g-0">
      <div :class="columnClass(0)">
        <div ref="col0"
          class="d-flex align-items-center justify-content-center text-black text-center flex-animated bg-white position-relative"
          style="z-index: 1; overflow-x: hidden;" :class="hovered === 0 ? 'shadow-lg' : ''" :style="getColumnStyle(0)"
          @mouseover="hovering = 0" @mouseleave="hovering = null" tabindex="0">
          <div class="column-content position-relative">
            <template v-if="hovered === null">
              <RandomIconBounce :icons="softwareIcons" :count="8" :area="{ width: 700, height: 900 }" :speed="1"
                :localBoxSize="120" />
              <div class="portrait-blur-wrapper">
                <div class="d-none d-lg-block portrait-img" :class="{ blurred: hovering === 0 }"
                  :style="getPortraitStyle('left', hovered === 0)"></div>
                <div class="d-block d-lg-none">
                  <img src="../assets/portrait-lookdown.png" class="portrait-img-sm" alt=""
                    :class="{ blurred: hovering === 0 }">
                </div>
                <transition name="fade">
                  <div v-if="hovering === 0" class="hover-text-centered text-left">
                    <h3 class="fw-bold pb-3">Software Engineering Projects</h3>
                    <p>Enterprise-level web applications built using Java, Spring Boot, Spring MVC, RESTful APIs,
                      Angular,
                      Vue, TypeScript, HTML/CSS, and JavaScript—alongside Ruby on Rails and PHP for selected services.
                    </p>
                    <p>
                      These projects were developed for Dialog Ideamart, the IoT division of Dialog Axiata, focusing on
                      scalable backend systems, efficient API integrations, and user-focused interfaces.
                    </p>
                    <p>
                      Tools like Postman were used for robust API testing and development.
                    </p>
                    <div class="d-grid gap-2 pt-2">
                      <button class="btn btn-primary-cs" type="button" style="pointer-events: all;"
                        @click="toggleColumn(0)">Check out my Software
                        Engineering Projects</button>
                    </div>
                  </div>
                </transition>
              </div>
            </template>
            <template v-else-if="hovered === 0">
              <SoftwareEngineering @navigate-home=toggleColumn(0) />
            </template>
          </div>
        </div>
      </div>

      <div :class="columnClass(1)">
        <div
          class="d-flex align-items-center justify-content-center text-white text-center flex-animated bg-white position-relative"
          style="overflow-x: hidden;" :class="hovered === 1 ? 'shadow-lg' : ''" :style="getColumnStyle(1)"
          @mouseover="hovering = 1" @mouseleave="hovering = null" tabindex="0">
          <div class="column-content position-relative">
            <template v-if="hovered === null">
              <div class="portrait-blur-wrapper">
                <div class="d-none d-lg-block portrait-img" :class="{ blurred: hovering === 1 }"
                  :style="getPortraitStyle('center', hovered === 1)"></div>
                <div class="d-block d-lg-none">
                  <img src="../assets/portrait-lookahead.png" class="portrait-img-sm" alt=""
                    :class="{ blurred: hovering === 0 }">
                </div>
                <transition name="fade">
                  <div v-if="hovering === 1" class="hover-text-centered text-center">
                    <h3 class="fw-bold pb-3">Personal Projects</h3>
                    <p>A collection of creative and experimental builds crafted with Python, Objective-C, JavaScript,
                      HTML,
                      and CSS.</p>
                    <p> These projects explore automation, custom tools, and unique UI concepts—reflecting hands-on
                      learning and personal interest beyond formal work. </p>
                    <div class="d-grid gap-2 pt-2">
                      <button class="btn btn-accent-cs" type="button" style="pointer-events: all;"
                        @click="toggleColumn(1)">Check out my Personal
                        Projects</button>
                    </div>
                  </div>
                </transition>
              </div>
            </template>
            <template v-else-if="hovered === 1">
              <PersonalProjects @navigate-home=toggleColumn(1) />
            </template>
          </div>
        </div>
      </div>
      <div :class="columnClass(2)">
        <div ref="col2"
          class="d-flex align-items-center justify-content-center text-white text-center flex-animated bg-white position-relative"
          style="overflow-x: hidden;" :class="hovered === 2 ? 'shadow-lg' : ''" :style="getColumnStyle(2)"
          @mouseover="hovering = 2" @mouseleave="hovering = null" tabindex="0">
          <div class="column-content position-relative">
            <template v-if="hovered === null">
              <RandomIconBounce :icons="gameIcons" :count="8" :area="{ width: 850, height: 900 }" :speed="1"
                :localBoxSize="120" />
              <div class="portrait-blur-wrapper">
                <div class="d-none d-lg-block portrait-img" :class="{ blurred: hovering === 2 }"
                  :style="getPortraitStyle('right', hovered === 2)"></div>
                <div class="d-block d-lg-none">
                  <img src="../assets/portrait-lookup.png" class="portrait-img-sm" alt=""
                    :class="{ blurred: hovering === 0 }">
                </div>
                <transition name="fade">
                  <div v-if="hovering === 2" class="hover-text-centered text-right">
                    <h3 class="fw-bold pb-3">Game Engineer Projects</h3>
                    <p>Mobile and hyper-casual games developed using C# (Unity) and C++ for publishers like Voodoo,
                      Supersonic, and Yso Corp.</p>
                    <p>
                      These projects focus on fast-paced gameplay, polished mechanics, and
                      high-performance optimization tailored for mass-market publishing.
                    </p>
                    <div class="d-grid gap-2 pt-2">
                      <button class="btn btn-secondary-cs" type="button" style="pointer-events: all;"
                        @click="toggleColumn(2)">Check out my Game
                        Engineering
                        Projects</button>
                    </div>
                  </div>
                </transition>
              </div>
            </template>
            <template v-else-if="hovered === 2">
              <GameEngineering @navigate-home=toggleColumn(2) />
            </template>
          </div>
        </div>
      </div>
    </div>


    <!-- First Column -->
    <!-- <div ref="col0"
      class="d-flex align-items-center justify-content-center text-black text-center h-100 flex-animated bg-white position-relative"
      style="z-index: 1; overflow-x: hidden;" :class="hovered === 0 ? 'shadow-lg' : ''" :style="getColumnStyle(0)"
      @mouseover="hovering = 0" @mouseleave="hovering = null" tabindex="0">
      <div class="column-content position-relative">
        <template v-if="hovered === null">
          <RandomIconBounce :icons="softwareIcons" :count="8" :area="{ width: 700, height: 900 }" :speed="1"
            :localBoxSize="120" />
          <div class="portrait-blur-wrapper">
            <div class="portrait-img" :class="{ blurred: hovering === 0 }"
              :style="getPortraitStyle('left', hovered === 0)"></div>
            <transition name="fade">
              <div v-if="hovering === 0" class="hover-text-centered text-left">
                <h3 class="fw-bold pb-3">Software Engineering Projects</h3>
                <p>Enterprise-level web applications built using Java, Spring Boot, Spring MVC, RESTful APIs, Angular,
                  Vue, TypeScript, HTML/CSS, and JavaScript—alongside Ruby on Rails and PHP for selected services.
                </p>
                <p>
                  These projects were developed for Dialog Ideamart, the IoT division of Dialog Axiata, focusing on
                  scalable backend systems, efficient API integrations, and user-focused interfaces.
                </p>
                <p>
                  Tools like Postman were used for robust API testing and development.
                </p>
                <div class="d-grid gap-2 pt-2">
                  <button class="btn btn-primary-cs" type="button" style="pointer-events: all;"
                    @click="toggleColumn(0)">Check out my Software
                    Engineering Projects</button>
                </div>
              </div>
            </transition>
          </div>
        </template>
        <template v-else-if="hovered === 0">
          <SoftwareEngineering @navigate-home=toggleColumn(0) />
        </template>
      </div>
    </div> -->

    <!-- Second Column -->
    <!-- <div
      class="d-flex align-items-center justify-content-center text-white text-center h-100 flex-animated bg-white position-relative"
      style="overflow-x: hidden;" :class="hovered === 1 ? 'shadow-lg' : ''" :style="getColumnStyle(1)"
      @mouseover="hovering = 1" @mouseleave="hovering = null" tabindex="0">
      <div class="column-content position-relative">
        <template v-if="hovered === null">
          <div class="portrait-blur-wrapper">
            <div class="portrait-img" :class="{ blurred: hovering === 1 }"
              :style="getPortraitStyle('center', hovered === 1)"></div>
            <transition name="fade">
              <div v-if="hovering === 1" class="hover-text-centered text-center">
                <h3 class="fw-bold pb-3">Personal Projects</h3>
                <p>A collection of creative and experimental builds crafted with Python, Objective-C, JavaScript, HTML,
                  and CSS.</p>
                <p> These projects explore automation, custom tools, and unique UI concepts—reflecting hands-on
                  learning and personal interest beyond formal work. </p>
                <div class="d-grid gap-2 pt-2">
                  <button class="btn btn-accent-cs" type="button" style="pointer-events: all;"
                    @click="toggleColumn(1)">Check out my Personal
                    Projects</button>
                </div>
              </div>
            </transition>
          </div>
        </template>
        <template v-else-if="hovered === 1">
          <PersonalProjects @navigate-home=toggleColumn(1) />
        </template>
      </div>
    </div> -->

    <!-- Third Column -->
    <!-- <div ref="col2"
      class="d-flex align-items-center justify-content-center text-white text-center h-100 flex-animated bg-white position-relative"
      style="overflow-x: hidden;" :class="hovered === 2 ? 'shadow-lg' : ''" :style="getColumnStyle(2)"
      @mouseover="hovering = 2" @mouseleave="hovering = null" tabindex="0">
      <div class="column-content position-relative">
        <template v-if="hovered === null">
          <RandomIconBounce :icons="gameIcons" :count="8" :area="{ width: 850, height: 900 }" :speed="1"
            :localBoxSize="120" />
          <div class="portrait-blur-wrapper">
            <div class="portrait-img" :class="{ blurred: hovering === 2 }"
              :style="getPortraitStyle('right', hovered === 2)"></div>
            <transition name="fade">
              <div v-if="hovering === 2" class="hover-text-centered text-right">
                <h3 class="fw-bold pb-3">Game Engineer Projects</h3>
                <p>Mobile and hyper-casual games developed using C# (Unity) and C++ for publishers like Voodoo,
                  Supersonic, and Yso Corp.</p>
                <p>
                  These projects focus on fast-paced gameplay, polished mechanics, and
                  high-performance optimization tailored for mass-market publishing.
                </p>
                <div class="d-grid gap-2 pt-2">
                  <button class="btn btn-secondary-cs" type="button" style="pointer-events: all;"
                    @click="toggleColumn(2)">Check out my Game
                    Engineering
                    Projects</button>
                </div>
              </div>
            </transition>
          </div>
        </template>
        <template v-else-if="hovered === 2">
          <GameEngineering @navigate-home=toggleColumn(2) />
        </template>
      </div>
    </div> -->
  </div>
</template>

<script>
import RandomIconBounce from './RandomIconBounce.vue';
import SoftwareEngineering from './SEView.vue';
import GameEngineering from './GEView.vue';
import PersonalProjects from './PJView.vue';
import portraitOrig from '../assets/portrait-orig.png';
import portraitBW from '../assets/portrait-b&w.png';
import LinksView from './LinksView.vue';

export default {
  name: "ClientView",
  components: {
    RandomIconBounce,
    SoftwareEngineering,
    GameEngineering,
    PersonalProjects,
    LinksView,
  },
  data() {
    return {
      showWelcome: true,
      hovered: null,
      hovering: null,
      colAreas: [null, null, null], // Will hold {width, height} for each column
      defaultStyle: {
        flex: "0 0 33.3333vw",
        transition: "flex 0.1s cubic-bezier(0.4, 0, 0.2, 1)"
      },
      expandedStyle: {
        flex: "0 0 100vw",
        zIndex: 2,
        transition: "flex 0.1s cubic-bezier(0.4, 0, 0.2, 1)"
      },
      collapsedStyle: {
        flex: "0 0 0vw",
        overflow: "hidden",
        transition: "flex 0.1s cubic-bezier(0.4, 0, 0.2, 1)"
      },
      softwareIcons: [
        { id: 'java', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg' },
        { id: 'typescript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg' },
        { id: 'html', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
        { id: 'css', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
        { id: 'js', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
        { id: 'vue', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vuejs/vuejs-original.svg' },
        { id: 'ruby', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rails/rails-original-wordmark.svg' },
        { id: 'angular', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angularjs/angularjs-original.svg' },
        { id: 'node', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg' },
        { id: 'python', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original-wordmark.svg' },
        { id: 'sql', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuresqldatabase/azuresqldatabase-original.svg' },
        { id: 'firebase', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original-wordmark.svg' },
        { id: 'vs', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original-wordmark.svg' },
        { id: 'git', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original-wordmark.svg' },
        { id: 'pm', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg' },
        { id: 'dkr', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original-wordmark.svg' },
      ],
      gameIcons: [
        { id: 'c#', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg' },
        { id: 'cplus', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg' },
        { id: 'unity', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original-wordmark.svg' },
        { id: 'unreal', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unrealengine/unrealengine-original-wordmark.svg' },
        { id: 'blender', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/blender/blender-original-wordmark.svg' },
        { id: '3dm', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threedsmax/threedsmax-original.svg' },
        { id: 'godot', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/godot/godot-original-wordmark.svg' },
      ],
    }
  },
  watch: {
    showWelcome(val) {
      if (val) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
        this.$nextTick(this.measureColumns);
      }
    },
    hovered() {
      this.$nextTick(this.measureColumns);
    }
  },
  mounted() {
    if (this.showWelcome) {
      document.body.style.overflow = 'hidden';
    }
    this.$nextTick(this.measureColumns);
    window.addEventListener('resize', this.measureColumns);
  },
  beforeDestroy() {
    document.body.style.overflow = '';
    window.removeEventListener('resize', this.measureColumns);
  },
  methods: {
    toggleColumn(idx) {
      this.hovered = this.hovered === idx ? null : idx;
    },
    columnClass(idx) {
      if (this.hovered === null) {
        return 'col-12 col-lg-4 p-0 m-0 g-0';
      }
      if (this.hovered === idx) {
        return 'col-12 col-lg-12 p-0 m-0 g-0';
      }
      // Collapse/hide non-selected columns on lg and up
      return 'd-none d-lg-block col-lg-0 p-0 m-0 g-0';
    },
    getColumnStyle(idx) {
      if (this.showWelcome) {
        // Prevent interaction with columns while welcome is shown
        return { pointerEvents: "none", filter: "blur(2px)" };
      }
      // Bootstrap grid handles column widths; only adjust z-index/overflow.
      if (this.hovered === idx) {
        return { zIndex: 2 };
      }
      if (this.hovered !== null && this.hovered !== idx) {
        return { overflow: 'hidden' };
      }
      return {};
    },
    getPortraitStyle(position, isFull) {
      let width = isFull ? "100vw" : "43.3vw";
      let bgSize = "110vw";
      let bgPos = "center center";
      let bgImg = `url('${portraitOrig}')`;
      if (!isFull) {
        if (position === "left") { bgPos = "left center"; bgImg = `url('${portraitBW}')`; }
        else if (position === "center") bgPos = "center center";
        else if (position === "right") { bgPos = "right center"; bgImg = `url('${portraitBW}')`; }
      }
      else {
        if (position === "left") { bgImg = `url('${portraitBW}')`; }
        else if (position === "right") { bgImg = `url('${portraitBW}')`; }
      }
      return {
        width,
        height: "100vh",
        margin: 0,
        padding: 0,
        backgroundImage: bgImg,
        backgroundSize: bgSize,
        backgroundPosition: bgPos,
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
      };
    },
    measureColumns() {
      // For each column, measure its bounding box and update colAreas
      for (let i = 0; i < 3; i++) {
        const col = this.$refs['col' + i];
        if (col && col.offsetWidth && col.offsetHeight) {
          this.colAreas[i] = {
            width: col.offsetWidth,
            height: col.offsetHeight
          };
        }
      }
    }
  }
}
</script>

<style scoped>
/* Welcome Popup Overlay */
.welcome-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.welcome-popup {
  background: rgba(255, 255, 255, 0.98);
  border-radius: 18px;
  box-shadow: 0 4px 32px rgba(0, 0, 0, 0.18);
  text-align: center;
  z-index: 10000;
  /* width: 90vw; */
}

.column-content {
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.portrait-blur-wrapper {
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.portrait-img {
  width: 100%;
  height: 100vh;
  border-radius: 0;
  transition: filter 0.3s;
}

.portrait-img-sm {
  width: 100%;
  height: 100%;
  border-radius: 0;
  transition: filter 0.3s;
}


.portrait-img.blurred {
  filter: blur(6px) brightness(0.8);
}

.hover-text-centered {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 75%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, .98);
  color: #222;
  padding: 2rem 2.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.12);
  z-index: 10;
  pointer-events: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>