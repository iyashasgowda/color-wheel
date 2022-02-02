document.addEventListener('DOMContentLoaded', () => {
   const canvas = document.querySelector('canvas');
   const context = canvas.getContext('2d');
   buildColorWheel(canvas, 256, 'white');

   let dragging = false;
   document.querySelector('body').addEventListener('mouseup', () => (dragging = false));
   context.canvas.addEventListener('mousedown', () => (dragging = true));
   context.canvas.addEventListener('mouseup', () => (dragging = false));

   context.canvas.addEventListener('mousemove', (event) => {
      if (dragging) {
         const dot = document.querySelector('.dot');
         const data = context.getImageData(event.offsetX, event.offsetY, 1, 1);
         document.querySelector('.rgb-code').innerHTML = `RGB: ${data.data.slice(0, 3).join(', ')}`;

         dot.style.top = event.pageY + 'px';
         dot.style.left = event.pageX + 'px';
      }
   });

   context.canvas.addEventListener('click', (event) => {
      dragging = false;
      const dot = document.querySelector('.dot');
      const data = context.getImageData(event.offsetX, event.offsetY, 1, 1);
      document.querySelector('.rgb-code').innerHTML = `RGB: ${data.data.slice(0, 3).join(', ')}`;

      dot.style.top = event.pageY + 'px';
      dot.style.left = event.pageX + 'px';
   });
});

const buildColorWheel = (canvas, size, shade) => {
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
      grad.addColorStop(0, shade);
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
