const { execSync } = require("child_process");

function run(command) {

    console.log("> " + command);

    execSync(command, {
        stdio: "inherit"
    });

}

function push() {

    run("git add .");

    try {

        run('git commit -m "Actualización automática de datos"');

    }
    catch {

        console.log("No hay cambios para subir.");
        return;

    }

    run("git push");

}

module.exports = {
    push
};