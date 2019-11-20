App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
  if (window.ethereum) {
    App.web3Provider = window.ethereum;
    try {
      // Request account access
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      console.error("User denied account access")
    }
}
// Legacy dapp browsers...
else if (window.web3) {
  App.web3Provider = window.web3.currentProvider;
}
// If no injected web3 instance is detected, fall back to Ganache
else {
  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
}
web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Hiring.json', function(data) { //Make reference to the build folder
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var HiringArtifact = data;
      App.contracts.Hiring = TruffleContract(HiringArtifact);
    
      // Set the provider for our contract
      App.contracts.Hiring.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the adopted pets
      return App.markHired();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleHire);
  },

  markHired: function(alumnos, account) {
    var hiringInstance;

    App.contracts.Hiring.deployed().then(function(instance) {
      hiringInstance = instance;

      return hiringInstance.getAlumnos.call();
    }).then(function(alumnos) {
      for (i = 0; i < alumnos.length; i++) {
        if (alumnos[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });

  },

  handleHire: function(event) {
    event.preventDefault();

    var alumnoId = parseInt($(event.target).data('id'));

    var hiringInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
    
      var account = accounts[0];
    
      App.contracts.Hiring.deployed().then(function(instance) {
        hiringInstance = instance;
    
        // Execute adopt as a transaction by sending account
        return hiringInstance.hire(alumnoId, {from: account});
      }).then(function(result) {
        return App.markHired();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
