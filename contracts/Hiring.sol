pragma solidity ^0.5.0; /* Solitidy version to compile */

/* Declaras el contrato de Adoption*/
contract Hiring {
    address[16] public alumnos;

    // Adoptando un perro y la función Adoption recibe el parámetro del alumnoId
    function hire(uint alumnoId) public returns (uint) {
        require(alumnoId >= 0 && alumnoId <= 3);

        alumnos[alumnoId] = msg.sender; //Almacena el valor del sender que es persona que Adopta el perro

        return alumnoId;
    }

    // Retrieving the alumnos
    function getAlumnos() public view returns (address[16] memory) {
        return alumnos;
    }

}
