
namespace lavida {
    let buttonDiv: HTMLInputElement = document.getElementById("registration") as HTMLInputElement;
    buttonDiv.addEventListener("click", registrateMe);


    function registrateMe(): void {
        let nameValue: string = (document.getElementById("name") as HTMLInputElement).value;
        let passwordValue: string = (document.getElementById("password") as HTMLInputElement).value;

        if (!nameValue || !passwordValue) return;
        let newUser = new User(Math.floor((Date.now() + Math.random()) / 10000), nameValue, passwordValue, true);
        newUser.pushUser();

    }


}

