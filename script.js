document.addEventListener('DOMContentLoaded', () => {
   const canvas = document.querySelector('canvas');
   getColorWheel(canvas, 512);

   canvas.addEventListener('mousemove', (e) => {
      const context = canvas.getContext('2d');
      const data = context.getImageData(e.offsetX, e.offsetY, 1, 1);
      document.querySelector('.rgb-code').innerHTML = `RGB: ${data.data.slice(0, 3).join(', ')}`;
   });
});

const getColorWheel = (canvas, size) => {
   const context = canvas.getContext('2d');
   canvas.width = size;
   canvas.height = size;

   let angle = 0;
   let pivot = 0;

   const radius = size / 2;
   const rgb = [0, 0, 255];
   const offset = 4.322;

   while (angle < 360) {
      const pointer = (pivot + 3 - 1) % 3;

      if (rgb[pivot] < 255) rgb[pivot] = rgb[pivot] + offset > 255 ? 255 : rgb[pivot] + offset;
      else if (rgb[pointer] > 0) rgb[pointer] = rgb[pointer] > offset ? rgb[pointer] - offset : 0;
      else if (rgb[pivot] >= 255) {
         rgb[pivot] = 255;
         pivot = (pivot + 1) % 3;
      }

      const grad = context.createRadialGradient(radius, radius, 0, radius, radius, radius);
      grad.addColorStop(0, 'white');
      grad.addColorStop(1, `rgb(${rgb.map((h) => Math.floor(h)).join(',')})`);
      context.fillStyle = grad;

      context.globalCompositeOperation = 'source-over';
      context.beginPath();
      context.moveTo(radius, radius);
      context.arc(radius, radius, radius, angle * (Math.PI / 180), 360 * (Math.PI / 180));
      context.closePath();
      context.fill();
      angle++;
   }
};
