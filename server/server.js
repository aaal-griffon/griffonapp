const http = require('http');
const cors = require('cors');
const { exec } = require('child_process'); 
const mavsdk = require('mavsdk'); // MAVSDK'yı import et

const hostname = '127.0.0.1';
const port = 3000;

const corsOptions = {
  origin: 'http://localhost:8081', 
  optionsSuccessStatus: 200 
};

const server = http.createServer(async (req, res) => { // async ekledik
  cors(corsOptions)(req, res, async () => { // async ekledik
    if (req.method === 'GET') { // GET isteği için kontrol
      try {
        // MAVSDK kullanarak ArduPilot'a bağlan
        const drone = new mavsdk.Drone();
        await drone.connect({ uri: '127.0.0.1:5760' }); // Bağlantı bilgilerini güncelleyin

        // İstediğiniz parametreleri alın
        const altitude = (await drone.telemetry.position()).relativeAltitudeM;
        const battery = (await drone.telemetry.battery()).remainingPercent;

        // Verileri JSON formatında birleştirin
        const data = JSON.stringify({ altitude, battery });

        // İsteği cevapla
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(data);

        // Bağlantıyı kapat
        await drone.disconnect();
      } catch (error) {
        console.error('ArduPilot bağlantısı veya veri alımı sırasında hata oluştu:', error);
        res.statusCode = 500;
        res.end('Sunucu hatası');
      }
    } else if (req.method === 'POST') {
      // ... (önceki kodunuz)
    } else {
      res.statusCode = 405;
      res.setHeader('Allow', 'GET, POST'); // İzin verilen metodları güncelledik
      res.end('Sadece GET ve POST isteklerine izin verilir');
    }
  });
});

server.listen(port, hostname, () => {
  console.log(`Sunucu http://${hostname}:${port} adresinde çalışıyor`);
}); 