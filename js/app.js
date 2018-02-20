"use strict"
const randomNumber = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// CHARACTER CONSTRUCTOR
// name should be their name.
// portrait should be a path to a character portrait as a string
// inventory should be a Item
// attack and defense should be integers
// ability should be a method of the Character.prototype object
// bio should be a short bio of the character as a string

function Character (name, portrait, attack, defense, inventory, ability, bio) {
    this.name = name;
    this.portrait = portrait;
    this.inventory = inventory;
    this.attack = attack;
    this.defense = defense;
    this.ability = ability;

    this.bio = bio;

    this.gold = 0;
    this.hp = 10;
    this.isActive = false;
};

Character.prototype.attack = function() {
    // initiate direct combat with enemy
};

Character.prototype.useItem = function () {
    // use inventory item
}

Character.prototype.run = function () {
    // end the game and apply sore to high score table
}

const charAbilities = {
    healing: function() {
        // heals 1-3 hp before every fight
    },

    dodge: function() {
        // 50% chance to take 0 damage
    },

    chaosMagic: function() {
        // randomly adds 0-10 to attack and defense
    }
};

// ITEMS
function Item (name) {
    this.name = name;
    this.used = false;
    this.equipped = false;
};

// MONSTERS
function SmallMonster () {
    this.portrait = 'images/smallmonster.png';
    this.hp = 1;
    this.gold = randomNumber(3,5);
    this.attack = randomNumber(2);
};

function MediumMonster () {
    this.portrait = 'images/mediummonster.jpg'
    this.hp = 2;
    this.gold = randomNumber(5,8);
    this.attack = randomNumber(3,4);
};

function LargeMonster () {
    this.hp = 3;
    this.portrait = 'images/largemonster.jpg'
    this.gold = randomNumber(8,12);
    this.attack = randomNumber(5,6);
};

const brute = new Character (
    'Brute',
    'images/brute.png',
    2,
    2,
    [new Item ('Heavy Armor'), new Item ('Second Weapon')],
    charAbilities.healing,
    'Zanshin hails from the distant jungle kingdom of Nyissa. Born into captivity and forced to fight in gladiatorial matches his entire life, this.troll is a versatile and proficient fighter. Despite a birth defect making his knee prone to injury (dislocated 25 times!), his combat skill - which balances both offense and defense- and his natural regenerative powers make him a force to be reckoned with. He enters the contest for a chance to buy his freedom and begin life anew..'
);

const rogue = new Character (
    'Rogue',
    'images/rogue.png',
    3,
    1,
    [new Item ('Smoke Bomb'), new Item ('Backpack')],
    charAbilities.dodge,
    'Rogue\'s parents may have been asking for trouble when they named their child "Rogue." They did their best to give her a good upbringing. And it worked, in ways: in theory, rogue is a pacifist. But more than that, she loves gold. If she can steal it without being seen, great. If not... Hey, it\'s not her fault that acquiring gold so often requires fighting to the death.'
);

const wizard = new Character (
    'Wizard',
    'images/wizard.png',
    1,
    0,
    [new Item ('Healing Potion'), new Item ('Mind Control Spell')],
    charAbilities.chaosMagic,
    'Touchstone the Tireless is a wizard of mysterious power and unknown origin. He is well versed in the schools of conjuration, telepathy, and restoration and uses these skills to bend enemies to his will. Some legends say he gained the name Tireless because of a never ending quest to rid the world of peanuts, due to a severe allergy to them.'
);
