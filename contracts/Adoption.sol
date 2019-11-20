pragma solidity ^0.5.0; /* Solitidy version to compile */

/* Declaras el contrato de Adoption*/
contract Adoption {
    address[16] public adopters;

    // Adoptando un perro y la función Adoption recibe el parámetro del PetID
    function adopt(uint petId) public returns (uint) {
        require(petId >= 0 && petId <= 15);

        adopters[petId] = msg.sender; //Almacena el valor del sender que es persona que Adopta el perro

        return petId;
    }

    // Retrieving the adopters
    function getAdopters() public view returns (address[16] memory) {
        return adopters;
    }

}
