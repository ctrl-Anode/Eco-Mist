<template>
  <div class="flex justify-center items-center min-h-screen bg-white p-4">
    <div class="relative w-full max-w-4xl h-[600px]">
      <!-- Admin/User Box -->
      <div class="absolute top-0 left-0 border-2 border-black w-[250px] h-[100px] flex items-center justify-center">
        <div class="font-mono text-lg">
          Admin<br />/User
        </div>
      </div>

      <!-- Center System Box -->
      <div class="absolute top-0 left-[350px] border-2 border-black rounded-3xl w-[300px] h-[180px] flex items-center justify-center text-center">
        <div class="font-mono">
          Eco-Mist: IoT-Driven<br />
          Web-based System for<br />
          Automated Management<br />
          and Monitoring of<br />
          Aeroponics Farming
        </div>
      </div>

      <!-- Device Box -->
      <div class="absolute top-0 right-0 border-2 border-black w-[250px] h-[140px] flex items-center justify-center text-center">
        <div class="font-mono">
          Eco-Mist<br />
          Device<br />
          Vertical<br />
          Aeroponics<br />
          Tower
        </div>
      </div>

      <!-- Input Image -->
      <div class="absolute top-[180px] left-0 text-right">
        <div class="flex items-center">
          <span class="mr-2 text-sm font-mono text-blue-800">Input Image</span>
          <div class="w-[200px] h-px bg-black relative">
            <div class="absolute right-0 top-0 w-2 h-2 border-t-2 border-r-2 border-black transform rotate-45 -mt-1"></div>
          </div>
        </div>
      </div>

      <!-- Device Adjustments -->
      <div class="absolute top-[230px] left-0 text-right">
        <div class="flex items-center">
          <span class="mr-2 text-sm font-mono text-blue-800">Device Adjustments</span>
          <div class="w-[200px] h-px bg-black relative">
            <div class="absolute right-0 top-0 w-2 h-2 border-t-2 border-r-2 border-black transform rotate-45 -mt-1"></div>
          </div>
        </div>
      </div>

      <!-- Announcement and Communication -->
      <div class="absolute top-[280px] left-0 text-right">
        <div class="flex items-center">
          <span class="mr-2 text-sm font-mono text-blue-800">Announcement and<br/>Communication</span>
          <div class="w-[200px] h-px bg-black relative">
            <div class="absolute right-0 top-0 w-2 h-2 border-t-2 border-r-2 border-black transform rotate-45 -mt-1"></div>
          </div>
        </div>
      </div>

      <!-- Income and Expense Management -->
      <div class="absolute top-[345px] left-0 text-right">
        <div class="flex items-center">
          <span class="mr-2 text-sm font-mono text-blue-800">Income and Expense<br/>Management</span>
          <div class="w-[200px] h-px bg-black relative">
            <div class="absolute right-0 top-0 w-2 h-2 border-t-2 border-r-2 border-black transform rotate-45 -mt-1"></div>
          </div>
        </div>
      </div>

      <!-- Data from processed image -->
      <div class="absolute top-[415px] left-0 text-right">
        <div class="flex items-center">
          <span class="mr-2 text-sm font-mono text-blue-800">Data from processed<br/>image</span>
          <div class="w-[200px] h-px bg-black relative">
            <div class="absolute left-0 top-0 w-2 h-2 border-t-2 border-l-2 border-black transform -rotate-45 -mt-1"></div>
          </div>
        </div>
      </div>

      <!-- Real-Time Notification -->
      <div class="absolute top-[485px] left-0 text-right">
        <div class="flex items-center">
          <span class="mr-2 text-sm font-mono text-blue-800">Real-Time Notification</span>
          <div class="w-[200px] h-px bg-black relative">
            <div class="absolute left-0 top-0 w-2 h-2 border-t-2 border-l-2 border-black transform -rotate-45 -mt-1"></div>
          </div>
        </div>
      </div>

      <!-- Real-time Monitoring -->
      <div class="absolute top-[530px] left-0 text-right">
        <div class="flex items-center">
          <span class="mr-2 text-sm font-mono text-blue-800">Real-time Monitoring</span>
          <div class="w-[200px] h-px bg-black relative">
            <div class="absolute left-0 top-0 w-2 h-2 border-t-2 border-l-2 border-black transform -rotate-45 -mt-1"></div>
          </div>
        </div>
      </div>

      <!-- Misting Cycle -->
      <div class="absolute top-[385px] right-0">
        <div class="flex items-center">
          <div class="w-[200px] h-px bg-black relative">
            <div class="absolute right-0 top-0 w-2 h-2 border-t-2 border-r-2 border-black transform rotate-45 -mt-1"></div>
          </div>
          <span class="ml-2 text-sm font-mono text-blue-800">Misting<br/>Cycle</span>
        </div>
      </div>

      <!-- Sensor Data -->
      <div class="absolute top-[230px] right-0">
        <div class="flex items-center">
          <div class="w-[200px] h-px bg-black relative">
            <div class="absolute left-0 top-0 w-2 h-2 border-t-2 border-l-2 border-black transform -rotate-45 -mt-1"></div>
          </div>
          <span class="ml-2 text-sm font-mono text-blue-800">Sensor Data</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "EcoMistDiagram"
};
</script>