window.addEventListener("load", changeGradient);


function changeGradient(): void {
    console.log(`radial-gradient(circle, rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},1}) 0%, rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},1}) 100%)`);
    document.body.style.background = `radial-gradient(circle, rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1) 0%, rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1) 100%)`;

}
