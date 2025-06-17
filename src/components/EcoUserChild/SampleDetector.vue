<template>
  <div class="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-xl mb-5">
    <div v-if="modelInfo" class="mt-4 text-sm text-gray-600">
  <p><strong>Model:</strong> {{ modelInfo.model_name }}</p>
  <p><strong>Version:</strong> {{ modelInfo.version }}</p>
  <p><strong>Input Shape:</strong> [{{ modelInfo.input_shape.join(', ') }}]</p>
  <p><strong>Classes:</strong> {{ modelInfo.classes.join(', ') }}</p>
</div>

    <h2 class="text-xl font-bold mb-4 mt-10">Crop Disease Detection</h2>
<!-- Tab Navigation -->
    <div class="flex flex-wrap gap-4 mb-6 border-b pb-2">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        :class="[
          'px-4 py-2 font-medium',
          activeTab === tab ? 'text-emerald-600 border-b-2 border-emerald-600' : 'text-gray-500'
        ]"
      >
        {{ tab }}
      </button>
      <button 
        @click="exportHistoryToCSV"
        class="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
      >
        ⬇️ Export CSV
      </button>

    </div>


    
<img v-if="filePreview" :src="filePreview" class="w-full max-h-64 object-cover rounded mt-4" />
<!-- Camera Preview -->
<div class="mt-6">
  <h4 class="text-md font-semibold mb-2">Live Camera</h4>
  <video ref="videoRef" autoplay playsinline class="w-full rounded-lg border border-gray-300"></video>
  <button
  class="mt-3 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
  @click="toggleCamera"
>
  {{ cameraActive ? '🛑 Stop Camera' : '🎥 Start Camera' }}
</button>


  <button
    class="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    @click="captureImage"
  >
    📷 Capture from Camera
  </button>
</div>


<!-- Hidden Canvas for Snapshot -->
<canvas ref="canvasRef" class="hidden"></canvas>

    <input type="file" accept="image/*" @change="onFileChange" class="mb-4" />
    

    <button
      class="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded disabled:opacity-50"
      :disabled="!file || loading"
      @click="analyzeImage"
    >
      {{ loading ? "Analyzing..." : "Analyze Image" }}
    </button>

    <div v-if="result" class="mt-6">
      <h3 class="font-semibold text-lg mb-2">Prediction: {{ result.prediction }}</h3>
      <p>Confidence: {{ (result.confidence * 100).toFixed(2) }}%</p>

      <h4 class="mt-4 font-semibold">Recommendations</h4>
      <ul class="list-disc list-inside">
        <li v-for="(rec, i) in result.recommendations" :key="i">{{ rec }}</li>
      </ul>
    </div>
    <div v-if="history.length" class="mt-10">
  <h3 class="text-lg font-bold mb-3">🕒 Analysis History</h3>
  <div class="space-y-4">
    <div
      v-for="item in history"
      :key="item.id"
      class="border rounded-lg p-4 shadow-sm bg-gray-50 flex justify-between items-center"
    >
      <div>
        <p class="text-sm text-gray-800"><strong>{{ item.prediction }}</strong> - {{ (item.confidence * 100).toFixed(2) }}%</p>
        <p class="text-xs text-gray-500">🕓 {{ item.createdAt?.toDate().toLocaleString() }}</p>
      </div>
      <div class="flex gap-2">
        <button
  class="text-blue-600 text-sm underline"
  @click="selectedItem = item"
>View</button>
        <button
  class="text-red-500 text-sm"
  @click="confirmDelete(item)"
>Delete</button>

      </div>
    </div>
    <!-- Detail Viewer -->
<div v-if="selectedItem" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
  <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full relative">
    <button @click="closeDetails" class="absolute top-2 right-3 text-gray-500 hover:text-black text-xl">&times;</button>
    <h3 class="text-lg font-bold mb-2">Prediction Details</h3>
    <img :src="selectedItem.imageUrl" class="w-full rounded mb-3" />
    <p><strong>Prediction:</strong> {{ selectedItem.prediction }}</p>
    <p><strong>Confidence:</strong> {{ (selectedItem.confidence * 100).toFixed(2) }}%</p>
    <p class="mt-2 font-medium">Recommendations:</p>
    <ul class="list-disc list-inside text-sm text-gray-700">
      <li v-for="(rec, i) in selectedItem.recommendations" :key="i">{{ rec }}</li>
    </ul>
    <p class="mt-2 text-xs text-gray-500">Analyzed: {{ selectedItem.createdAt?.toDate().toLocaleString() }}</p>
  </div>
</div>
<div v-if="activeTab === 'Detector'">
      <!-- Your existing detection interface -->
      <slot name="detector" />
    </div>
<div v-if="activeTab === 'Insights'">
  <button
    @click="exportInsightsToPDF"
    class="mb-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
  >
    📄 Export to PDF
  </button>
   <!-- Insights Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="mt-6">
  <h3 class="text-lg font-bold mb-2">Disease-Specific Insights</h3>
  <div v-for="(info, disease) in diseaseInsights" :key="disease" class="bg-white p-4 rounded shadow mb-4">
    <h4 class="text-md font-semibold text-emerald-700">{{ disease }}</h4>
    <p><strong>Occurrences:</strong> {{ info.count }}</p>
    <p><strong>Avg Confidence:</strong> {{ info.avgConfidence.toFixed(2) }}%</p>
    <p><strong>Last Detected:</strong> {{ info.latest || 'N/A' }}</p>
    <p><strong>Common Recommendations:</strong></p>
    <ul class="list-disc list-inside text-sm">
      <li v-for="(rec, i) in info.recommendations.slice(0, 3)" :key="i">{{ rec }}</li>
    </ul>
  </div>
</div>
        <div class="bg-white p-4 rounded shadow text-center">
          <p class="text-gray-500">Total Analyses</p>
          <h2 class="text-2xl font-bold">{{ insights.total }}</h2>
        </div>
        <div class="bg-white p-4 rounded shadow text-center">
          <p class="text-gray-500">Healthy</p>
          <h2 class="text-2xl font-bold">{{ insights.Healthy }}</h2>
        </div>
        <div class="bg-white p-4 rounded shadow text-center">
          <p class="text-gray-500">Bacterial</p>
          <h2 class="text-2xl font-bold">{{ insights.Bacterial }}</h2>
        </div>
        <div class="bg-white p-4 rounded shadow text-center">
          <p class="text-gray-500">Fungal</p>
          <h2 class="text-2xl font-bold">{{ insights.Fungal }}</h2>
        </div>
      </div>

      <!-- Chart: Disease Distribution Pie -->
      <div class="bg-white p-4 rounded shadow mb-6">
        <h3 class="text-lg font-semibold mb-2">Disease Distribution</h3>
        <canvas ref="chartPie" height="250"></canvas>
      </div>

      <!-- Charts: Confidence Trend and Avg Confidence -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-4 rounded shadow">
          <h3 class="text-lg font-semibold mb-2">Confidence Trend</h3>
          <canvas ref="chartLine" height="250"></canvas>
        </div>

        <div class="bg-white p-4 rounded shadow">
          <h3 class="text-lg font-semibold mb-2">Avg Confidence by Type</h3>
          <canvas ref="chartBar" height="250"></canvas>
        </div>
      </div>
    </div>
</div>
<div v-if="showDeleteConfirm" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
  <div class="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
    <h2 class="text-lg font-bold mb-2 text-gray-800">Delete Analysis?</h2>
    <p class="text-sm text-gray-600 mb-4">
      Are you sure you want to delete this analysis? This action cannot be undone.
    </p>
    <div class="flex justify-end gap-3">
      <button @click="cancelDelete" class="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100">Cancel</button>
      <button @click="proceedDelete" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Yes, Delete</button>
    </div>
  </div>
</div>

  </div>
</div>

  <div v-if="toastMessage" :class="['fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white', toastType]" @click="clearToast">
    {{ toastMessage }}
  </div>
</template>

<script setup>
import { onSnapshot, query, where, orderBy, deleteDoc, doc, getDocs } from 'firebase/firestore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { onAuthStateChanged } from 'firebase/auth';
import { ref as vueRef,onMounted, watch, ref, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
import {
  auth,
  db,
  storage
} from '../../firebase'; // your firebase.js
import {
  addDoc,
  collection,
  serverTimestamp
} from 'firebase/firestore';
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

// Refs for reactivity
const file = vueRef(null);
const result = vueRef(null);
const loading = vueRef(false);

const diseaseInsights = ref({});

const selectedItem = vueRef(null);
const closeDetails = () => selectedItem.value = null;


// Triggered on file selection

const filePreview = vueRef(null);

const onFileChange = (e) => {
  file.value = e.target.files[0];
  if (file.value) {
    filePreview.value = URL.createObjectURL(file.value);
  }
};


// Main prediction + upload function
const analyzeImage = async () => {
  if (!file.value || !auth.currentUser) {
    showToast("Please log in and upload a file.", 'bg-yellow-500');
    return;
  }

  loading.value = true;

  try {
    // Step 1: Upload image to Flask API
    const formData = new FormData();
    formData.append('file', file.value);

    const token = await auth.currentUser.getIdToken();

    const response = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const predictionData = await response.json();
    if (predictionData.status !== 'success') {
      throw new Error('Prediction failed');
    }

    result.value = predictionData;

    // Step 2: Upload the image to Firebase Storage
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.value.name}`;
    const path = `disease_uploads/${auth.currentUser.uid}/${filename}`;
    const imageStorageRef = storageRef(storage, path);

    await uploadBytes(imageStorageRef, file.value);
    const imageUrl = await getDownloadURL(imageStorageRef);

    // Step 3: Save prediction + metadata to Firestore
    await addDoc(collection(db, 'analysisHistory'), {
      userId: auth.currentUser.uid,
      imageUrl,
      prediction: predictionData.prediction,
      confidence: predictionData.confidence,
      classProbabilities: predictionData.class_probabilities,
      recommendations: predictionData.recommendations,
      createdAt: serverTimestamp()
    });

    console.log('✅ Saved prediction to Firestore');
    showToast("Image analyzed successfully!", 'bg-green-500');
  } catch (err) {
    console.error('❌ Error:', err.message || err);
    showToast(`Error: ${err.message || 'An unexpected error occurred.'}`, 'bg-red-500');
  } finally {
    loading.value = false;
  }
};

const modelInfo = vueRef(null);

const fetchModelInfo = async () => {
  try {
    const response = await fetch('http://127.0.0.1:5000/model-info');
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    const data = await response.json();
    modelInfo.value = data;
    console.log("✅ Model Info:", data);
  } catch (err) {
    console.error("❌ Failed to fetch model info:", err);
    showToast(`Error: ${err.message || 'Failed to fetch model info.'}`, 'bg-red-500');
  }
};
onMounted(() => {
  fetchModelInfo();
});
const videoRef = vueRef(null);
const canvasRef = vueRef(null);

// Start camera stream on mount
onMounted(() => {
  fetchModelInfo(); // keep your model info fetch
  loadHistory(); // Load analysis history
});

const initCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.value.srcObject = stream;
  } catch (err) {
    console.error("❌ Failed to access camera:", err);
    alert("Camera not supported or permission denied.");
  }
};

// Capture image from video
const captureImage = () => {
  const video = videoRef.value;
  const canvas = canvasRef.value;

  const width = video.videoWidth;
  const height = video.videoHeight;

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, width, height);

  // Convert canvas to blob → file
  canvas.toBlob(blob => {
    const capturedFile = new File([blob], `captured_${Date.now()}.jpg`, { type: 'image/jpeg' });
    file.value = capturedFile;
    filePreview.value = URL.createObjectURL(capturedFile);
    console.log("📷 Captured image ready for analysis.");
  }, 'image/jpeg', 0.95);
};
const stopCamera = () => {
  const stream = videoRef.value?.srcObject;
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    videoRef.value.srcObject = null;
    console.log("📴 Camera stopped.");
  }
};
const cameraActive = vueRef(false);

const toggleCamera = () => {
  if (cameraActive.value) {
    stopCamera();
  } else {
    initCamera();
  }
  cameraActive.value = !cameraActive.value;
};

const history = vueRef([]); // analysis history

const loadHistory = () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.warn("User not authenticated. Cannot load history.");
      return;
    }

    const q = query(
      collection(db, 'analysisHistory'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    onSnapshot(q, (snapshot) => {
      history.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("📜 History loaded:", history.value);
    });
  });
};
const deleteHistory = async (id) => {
  try {
    await deleteDoc(doc(db, 'analysisHistory', id));
    showToast("Analysis deleted successfully!", 'bg-green-500');
  } catch (err) {
    console.error("❌ Failed to delete history:", err);
    showToast(`Error: ${err.message || 'Failed to delete item.'}`, 'bg-red-500');
  }
};
/////////////////////

const tabs = ['Detector', 'Insights'];
const activeTab = ref('Detector');

const chartPie = ref(null);
const chartLine = ref(null);
const chartBar = ref(null);

const insights = ref({
  total: 0,
  Healthy: 0,
  Bacterial: 0,
  Fungal: 0
});
import { getAuth } from 'firebase/auth';

const loadInsights = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const q = query(
    collection(db, 'analysisHistory'),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  );

  onSnapshot(q, async (snapshot) => {
    const data = snapshot.docs.map(doc => doc.data());

    const summary = { total: data.length, Healthy: 0, Bacterial: 0, Fungal: 0 };
    const byDate = [];
    const byLabel = {};

    data.forEach((item) => {
      const label = item.prediction;
      summary[label] = (summary[label] || 0) + 1;

      const date = item.createdAt?.toDate().toLocaleDateString?.() || 'Unknown';
      byDate.push({ x: date, y: item.confidence });

      if (!byLabel[label]) byLabel[label] = [];
      byLabel[label].push(item.confidence);
    });

    insights.value = summary;

    await nextTick(); // 👈 ensure chart canvases are in DOM
    drawCharts(summary, byDate, byLabel);
    computeDiseaseInsights(data);

  });
};

const computeDiseaseInsights = (data) => {
  const insights = {};

  data.forEach(item => {
    const label = item.prediction;
    const conf = item.confidence;
    const date = item.createdAt?.toDate().toLocaleString?.() || 'Unknown';
    const recs = item.recommendations || [];

    if (!insights[label]) {
      insights[label] = {
        count: 0,
        totalConfidence: 0,
        latest: date,
        recommendations: []
      };
    }

    insights[label].count += 1;
    insights[label].totalConfidence += conf;

    if (!insights[label].latest || new Date(date) > new Date(insights[label].latest)) {
      insights[label].latest = date;
    }

    insights[label].recommendations.push(...recs);
  });

  for (const key in insights) {
    const i = insights[key];
    i.avgConfidence = (i.totalConfidence / i.count) * 100;
    i.recommendations = [...new Set(i.recommendations)]; // remove duplicates
  }

  diseaseInsights.value = insights;
};


const drawCharts = (summary, confidenceTrend, labelGroups) => {
  // Ensure chart elements exist before creating charts
  if (!chartPie.value || !chartLine.value || !chartBar.value) {
    console.error("❌ Chart elements are not initialized.");
    return;
  }

  // Destroy existing charts if they exist
  pieChart?.destroy();
  lineChart?.destroy();
  barChart?.destroy();

  // Create new charts
  pieChart = new Chart(chartPie.value, {
    type: 'pie',
    data: {
      labels: Object.keys(summary).filter(k => k !== 'total'),
      datasets: [{
        data: Object.keys(summary).filter(k => k !== 'total').map(k => summary[k]),
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 1
      }]
    },
    options: { responsive: true, animation: { duration: 500 } }
  });

  lineChart = new Chart(chartLine.value, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Confidence Over Time',
        data: confidenceTrend,
        fill: false,
        borderColor: '#3b82f6'
      }]
    },
    options: { responsive: true, animation: { duration: 500 } }
  });

  barChart = new Chart(chartBar.value, {
    type: 'bar',
    data: {
      labels: Object.keys(labelGroups),
      datasets: [{
        label: 'Avg Confidence',
        data: Object.values(labelGroups).map(arr => arr.reduce((a, b) => a + b) / arr.length),
        backgroundColor: '#6366f1'
      }]
    },
    options: { responsive: true, animation: { duration: 500 } }
  });
};

watch(activeTab, (val) => {
  if (val === 'Insights') {
    loadInsights();
  }
});


let pieChart = null;
let lineChart = null;
let barChart = null;

const exportHistoryToCSV = () => {
  if (!history.value.length) return;

  const headers = [
    'Prediction',
    'Confidence',
    'Created At',
    'Image URL',
    'Recommendations',
    'Class Probabilities',
    'User ID'
  ];

  const rows = history.value.map(item => [
    item.prediction,
    (item.confidence * 100).toFixed(2) + '%',
    item.createdAt?.toDate().toLocaleString() || '',
    item.imageUrl || '',
    JSON.stringify(item.recommendations || []),
    JSON.stringify(item.classProbabilities || {}),
    item.userId || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'EcoMist-Detection-Report.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportInsightsToPDF = async () => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  let y = 10;

  pdf.setFontSize(18);
  pdf.text("Crop Disease Insights Report", 14, y);
  y += 10;

  pdf.setFontSize(12);
  pdf.text(`Total Analyses: ${insights.value.total}`, 14, y += 10);
  pdf.text(`Healthy: ${insights.value.Healthy}`, 14, y += 7);
  pdf.text(`Bacterial: ${insights.value.Bacterial}`, 14, y += 7);
  pdf.text(`Fungal: ${insights.value.Fungal}`, 14, y += 7);

  const addCanvasToPDF = async (canvasEl, label) => {
    if (!canvasEl) return;

    const canvas = await html2canvas(canvasEl, {
      scale: 2,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');

    if (y > 200) {
      pdf.addPage();
      y = 10;
    }

    pdf.setFontSize(14);
    pdf.text(label, 14, y += 10);
    pdf.addImage(imgData, 'PNG', 14, y += 5, 180, 90);
    y += 95;
  };

  await nextTick(); // ensure charts are rendered

  await addCanvasToPDF(chartPie.value, 'Disease Distribution');
  await addCanvasToPDF(chartLine.value, 'Confidence Trend');
  await addCanvasToPDF(chartBar.value, 'Average Confidence by Type');

  // ✅ Add Disease-Specific Insights
  pdf.addPage();
  let dy = 10;

  pdf.setFontSize(16);
  pdf.text("Disease-Specific Insights", 14, dy);
  dy += 10;
  pdf.setFontSize(11);

  Object.entries(diseaseInsights.value).forEach(([label, info]) => {
    if (dy > 270) {
      pdf.addPage();
      dy = 10;
    }

    pdf.setFont(undefined, 'bold');
    pdf.text(`${label}`, 14, dy);
    pdf.setFont(undefined, 'normal');

    dy += 6;
    pdf.text(`Occurrences: ${info.count}`, 18, dy += 6);
    pdf.text(`Avg Confidence: ${info.avgConfidence.toFixed(2)}%`, 18, dy += 6);
    pdf.text(`Last Detected: ${info.latest}`, 18, dy += 6);

    if (info.recommendations.length) {
      pdf.text(`Recommendations:`, 18, dy += 6);
      info.recommendations.slice(0, 3).forEach((rec) => {
        dy += 6;
        if (dy > 270) {
          pdf.addPage();
          dy = 10;
        }
        pdf.text(`- ${rec}`, 22, dy);
      });
    }

    dy += 10;
  });

  pdf.save('EcoMist-Analytics-&-Insights-Report.pdf');
};



const toastMessage = vueRef(null);
const toastType = vueRef('');

const showToast = (message, type = 'bg-green-500') => {
  toastMessage.value = message;
  toastType.value = type;
  setTimeout(() => {
    toastMessage.value = null;
    toastType.value = '';
  }, 3000); // Auto-hide after 3 seconds
};

const clearToast = () => {
  toastMessage.value = null;
  toastType.value = '';
};

// Accessibility: Detect reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Adjust animations/transitions based on reduced motion preference
const reducedMotionClass = prefersReducedMotion ? 'transition-none' : 'transition-all duration-300';

// Responsive design adjustments
onMounted(() => {
  const handleResize = () => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      console.log("📱 Mobile layout activated");
      // Add any mobile-specific logic here
    }
  };
  window.addEventListener('resize', handleResize);
  handleResize(); // Initial check
});
const showDeleteConfirm = vueRef(false);
const itemToDelete = vueRef(null);

const confirmDelete = (item) => {
  itemToDelete.value = item;
  showDeleteConfirm.value = true;
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
  itemToDelete.value = null;
};

const proceedDelete = async () => {
  if (!itemToDelete.value) return;
  await deleteHistory(itemToDelete.value.id);
  showDeleteConfirm.value = false;
  itemToDelete.value = null;
};

</script>

<style scoped>
/* Accessibility: Reduced motion styles */
.transition-none {
  transition: none !important;
}
.transition-all {
  transition: all 0.3s ease-in-out;
}

/* Responsive design styles */
@media (max-width: 768px) {
  .max-w-xl {
    width: 100%;
    padding: 4px;
  }
  .flex-wrap {
    flex-wrap: wrap;
  }
}
</style>