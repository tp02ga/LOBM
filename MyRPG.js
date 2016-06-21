var enemies = [];
var weapons = [
  {weaponType: "Fists", damage: [2,5], cost: 0, hitChance: 75},
  {weaponType: "GoblinFists", damage: [2,4], cost: 0, hitChance: 60},
  {weaponType: "Bite", damage: [1,2], cost: 0, hitChance: 60},
  {weaponType: "Dagger", damage: [5,7], cost: 25, hitChance: 80}
];

var armors = [
  {armorType: "Clothes", protection: 0},
  {armorType: "Leather Armor", protection: 2, cost: 50}
];

function Hero () {
  var name = 'Hero';
  var hp = 100;
  var exp = 0;
  var level = 1;
  var healthPotions = 3;
  var gold = 0;
  var weaponType = 'Fists';
  var armorType = 'Clothes';
  
  return {
    toString : function () {
	  var str = "{";
	  for (var prop in this)
	  {
	    if (prop == "toString")
		  continue;
		  
		var method = this[prop];
		if (prop.indexOf("get") == 0)
		{
		  var localVar = prop.substring(3);
		  
		  if (typeof method() === "string")
		  {
		    str += "\"" + localVar + "\"" + ": \"" + method() + "\", ";
		  }
		  else
		  {
		    str += "\"" + localVar + "\"" + ": " + method() + ", ";
		  }
		  
		}
	  }
	  str = str.substring(0, str.length - 2) + "}";
	  str = str.replace(/(\r\n|\n|\r)/gm,'');
	  str = str.replace('\t','');
	  return str;
	},
    getName : function () {
	  return name;
	},
	setName : function (val) {
	  name = val;
	},
	getHp : function () {
	  return hp;
	},
	setHp : function (val) {
	  hp = val;
	  localStorage.setItem('you', this);
	},
	getExp : function () {
	  return exp;
	},
	setExp : function (val) {
	  exp = val;
	  localStorage.setItem('you', this);
	},
	getGold : function () {
	  return gold;
	},
	setGold : function (val) {
	  gold = val;
	  localStorage.setItem('you', this);
	},
	getWeaponType : function () {
	  return weaponType;
	},
	setWeaponType : function (val) {
	  weaponType = val;
	  localStorage.setItem('you', this);
	},
	getArmorType : function () {
	  return armorType;
	},
	setArmorType : function (val) {
	  armorType = val;
	  localStorage.setItem('you', this);
	},
	getHealthPotions : function () {
	  return healthPotions;
	},
	setHealthPotions : function (val) {
	  healthPotions = val;
	  localStorage.setItem('you', this);
	},
	getLevel : function () {
	  return level;
	},
	setLevel : function (val) {
	  level = val;
	  localStorage.setItem('you', this);
	}
  };
}

var you = new Hero();

var currentEnemy;

function Enemy (hp, exp, lootLevel, weaponType) {
  this.hp = hp;
  this.exp = exp;
  this.lootLevel = lootLevel;
  this.weaponType = weaponType;
}

function Goblin ()
{
  this.enemyType = "Goblin";
  Enemy.call(this, 10, [5,10], 1, "GoblinFists");
}

function GiantRat ()
{
  this.enemyType = "Giant Rat";
  Enemy.call(this, 5, [2,5], 1, "Bite");
}

function Bandit ()
{
  this.enemyType = "Bandit";
  Enemy.call(this, 30, [15,25], 2, "Fists");
}

function init()
{
  if (!localStorage.you)
  {
	  enemies.push("Goblin");
	  enemies.push("Goblin");
	  enemies.push("Giant Rat");
	  enemies.push("Giant Rat");
	  enemies.push("Giant Rat");
	  enemies.push("Bandit");
	  
	  localStorage.setItem("you", you);
	  localStorage.setItem("enemies", JSON.stringify(enemies));
  }
  else
  {
    you = new Hero();
    var storedHero = JSON.parse(localStorage.getItem("you"));
	
	for (var key in storedHero) {
      if (storedHero.hasOwnProperty(key)) {
	    var method = "you.set" + key;
        if (typeof storedHero[key] === "string")
		  method += "('"+storedHero[key]+"')";
		else
		  method += "("+storedHero[key]+")";
		
		eval(method);
      }
    }  
	enemies = JSON.parse(localStorage.getItem("enemies"));
  }
  updateStatusBar();
}

function updateStatusBar ()
{
  var status = document.getElementById("statusBar");
  status.innerHTML = "Level: " + you.getLevel() + "&nbsp;&nbsp;&nbsp;&nbsp; Experience: " + you.getExp() + 
  "/" + (you.getLevel()*2)*100 + "&nbsp;&nbsp;&nbsp;&nbsp; HP: " + you.getHp() + "&nbsp;&nbsp;&nbsp;&nbsp; Gold: " + you.getGold();
}
function RandomNumber(min, max)
{
  var randomNumber = Math.floor((Math.random() * (max+1)) + min);
  return randomNumber;
}

function startForestFight ()
{
  currentEnemy = getNewEnemyToFight();
  document.getElementById("location").innerHTML = "In the Forest";
  document.getElementById("situation").innerHTML = "You've run into a " + currentEnemy.enemyType;
  document.getElementById("forest").style.display = "none";
  document.getElementById("attack").style.display = "inline";
  document.getElementById("fights").style.display = "block";
  document.getElementById("run").style.display = "inline";
  document.getElementById("town").style.display = "none";
  document.getElementById("store").style.display = "none";
  clearMessages();
}

function getWeapon (weaponType)
{
  for (var i=0; i<weapons.length; i++)
  {
    if (weapons[i].weaponType == weaponType)
	{
	  return weapons[i];
	}
  }
}

function getArmor (armorType)
{
  for (var i=0; i<armors.length; i++)
  {
    if (armors[i].armorType == armorType)
	{
	  return armors[i];
	}
  }
}

function calculateDamage(weapon)
{
  return RandomNumber(weapon.damage[0], weapon.damage[1]);
}

function showMessage (message) {
  var statusArea = document.getElementById("fights");
  statusArea.innerHTML += message + "<br/>";
  statusArea.scrollTop = statusArea.scrollHeight;
}

function clearMessages () {
  var statusArea = document.getElementById("fights");
  statusArea.innerHTML = "";
}
function attack ()
{
  var weapon = getWeapon(you.getWeaponType());
  
  if (!hit(weapon))
  {
    showMessage("You <span style='color: red;'>miss</span> the " + currentEnemy.enemyType);
    enemyAttacks();
	return;
  }
  
  var weapon = getWeapon(you.getWeaponType());
  var damage = calculateDamage(weapon);
  
  currentEnemy.hp -= damage;
  
  showMessage("You hit the " + currentEnemy.enemyType + " for <span style='color: green'>" + damage + " hp</span>");
  
  if (currentEnemy.hp <= 0)
  {
	var expPointsGained = RandomNumber(currentEnemy.exp[0], currentEnemy.exp[1]);
	you.setExp(you.getExp() + expPointsGained);
	
	var goldGained = RandomNumber(currentEnemy.lootLevel*3, currentEnemy.lootLevel*6);
	you.setGold(you.getGold() + goldGained);
	
	showMessage("You gained <span style='color: rgb(181, 0, 255);'>" + expPointsGained + " experience points</span>");
	showMessage("You gained <span style='color: rgb(253, 251, 64);'>" + goldGained + " gold</span>");
	updateStatusBar();
	currentEnemy = null;
	document.getElementById("forest").style.display = "inline";
	document.getElementById("attack").style.display = "none";
	document.getElementById("run").style.display = "none";
	document.getElementById("town").style.display = "inline";
  }
  else
  {
    enemyAttacks();
  }
}

function runAway ()
{
  var successChance = RandomNumber(1, 100);
  if (successChance <= 75)
  {
    gotoTown();
  }
  else
  {
    alert("You failed to run away and your enemy attacks!");
	enemyAttacks();
  }
}

function gotoTown () {
  if (window.location.href.indexOf("RPG.html") == -1)
  {
    window.location.href = "RPG.html";
  }
  document.getElementById("location").innerHTML = "In Town";
  document.getElementById("situation").innerHTML = "You are safely in town and feeling like you're ready to set off on an adventure!<br/><br/>What would you like to do?";
  document.getElementById("forest").style.display = "inline";
  document.getElementById("attack").style.display = "none";
  document.getElementById("fights").style.display = "none";
  document.getElementById("run").style.display = "none";
  document.getElementById("town").style.display = "none";
  document.getElementById("store").style.display = "inline";
}

function hit (weapon)
{
  var attackAttempt = RandomNumber(1, 100);
  if (attackAttempt <= weapon.hitChance)
    return true;
  else
    return false;
}

function enemyAttacks () {
  var weapon = getWeapon(currentEnemy.weaponType);
  
  if (!hit(weapon))
  {
    showMessage("The " + currentEnemy.enemyType + " <span style='color: green'>misses</span> you with their attack");
	return;
  }
  
  var damage = calculateDamage(weapon);
  var armor = getArmor(you.getArmorType());
  
  you.setHp(you.getHp() - (damage - armor.protection));
  if (armor.protection > 0)
    showMessage(currentEnemy.enemyType + " hit you for <span style='color: red'>" + (damage - armor.protection) + " hp</span> (<span style='color: blue'>" + armor.protection + " hp</span> absorbed by armor)");
  else
    showMessage(currentEnemy.enemyType + " hit you for <span style='color: red'>" + damage + " hp</span>");
    
  if (you.getHp() <= 0)
  {
    alert("You are dead");
	document.getElementById("forest").style.display = "none";
    document.getElementById("attack").style.display = "none";
    document.getElementById("fights").style.display = "none";
    document.getElementById("run").style.display = "none";
    document.getElementById("town").style.display = "none";
  }
  else
  {
    updateStatusBar();
  }
}

function getNewEnemyToFight()
{
  // get an enemy
  var index = RandomNumber(0, enemies.length-1);
  var enemyType = enemies[index];
  
  if (enemyType == "Giant Rat")
    return new GiantRat();
  else if (enemyType == "Goblin")
    return new Goblin();
  else if (enemyType == "Bandit")
    return new Bandit();
  
}

function gotoStore ()
{
  window.location.href = "store.html";
}

function buyWeapon (weaponType)
{
  var weapon = getWeapon(weaponType);
  if (you.getWeaponType() == weaponType)
  {
    alert("You're already using the " + weaponType);
  }
  else if (you.getGold() >= weapon.cost)
  {
    you.setGold(you.getGold() - weapon.cost);
	you.setWeaponType(weaponType);
	updateStatusBar();
	alert("You purchased the " + weaponType);
  }
  else
  {
    alert("You can't yet afford the " + weaponType);
  }
}

function buyArmor (armorType)
{
  var armor = getArmor(armorType);
  
  if (you.getArmorType() == armorType)
  {
    alert("You're already wearing the " + armorType);
  }
  else if (you.getGold() >= armor.cost)
  {
    you.setGold(you.getGold() - armor.cost);
	you.setArmorType(armorType);
	updateStatusBar();
	alert("You purchased the " + armorType);
  }
  else
  {
    alert("You can't yet afford the " + armorType);
  }
}