'use strict';

const combat = {
    characterSpecs: JSON.parse(localStorage.getItem('characterSpecs')),

    monster: new SmallMonster,

    monstersDefeated: 0,

    elements: {
        mainDungeon: document.getElementById('main-dungeon'),
        announcement: document.getElementById('announcement'),

        characterDiv: document.getElementById('character-div'),
        characterImg: document.getElementById('character-img'),
        characterHP: document.getElementById('character-hp'),
        characterGold: document.getElementById('character-gold'),
        
        monsterDiv: document.getElementById('monster-div'),
        monsterImg: document.getElementById('monster-img'),
        
        dungeonChoice: document.getElementById('dungeon-choice'),
        fight: document.getElementById('fight'),
        flee: document.getElementById('flee'),
        itemHeader: document.getElementById('item')
    },

    start: function () {
        this.load();
        this.loadAbility();
        this.equipItem();
        this.renderGraphics();
        this.elements.fight.addEventListener('click', this.preFight);
        this.elements.flee.addEventListener('click', this.flee);
        this.elements.itemHeader.addEventListener('click', combat.item.use);
    },

    load: function () {
        if (this.characterSpecs[0] === 'Zanshin') {
            combat.character = brute;
        } else if (this.characterSpecs[0] === 'Rogue') {
            combat.character = rogue;
        } else if (this.characterSpecs[0] === 'Touchstone') {
            combat.character = wizard;
        };

        if (this.characterSpecs[1] === 'Heavy Armor') {
            this.item = new Item('Heavy Armor');
        }
        if (this.characterSpecs[1] === 'Second Weapon') {
            this.item = new Item('Second Weapon');
        }
        if (this.characterSpecs[1] === 'Backpack') {
            this.item = new Item('Backpack');
        }
        if (this.characterSpecs[1] === 'Smoke Bomb') {
            this.item = new Item('Smoke Bomb');
        }
        if (this.characterSpecs[1] === 'Mind Control Scroll') {
            this.item = new Item('Mind Control Scroll');
        }
        if (this.characterSpecs[1] === 'Healing Potion') {
            this.item = new Item('Healing Potion');
        }
    },

    loadAbility: function () {
        if (combat.character.name === 'Zanshin') {
            combat.preFight = function() {
                if (combat.character.hp <= 10) {
                    combat.character.hp += 1;
                    combat.elements.announcement.textContent = 'Healed 1hp';
                    setTimeout(function() {combat.elements.announcement.textContent = "";}, 1000);
                }
                combat.fight();
            };       
        } else if (combat.character.name === 'Rogue') {
            combat.monsterAttack = function() {
                const random = randomNumber(1, 100);
                if (random < 51) {
                    const damage = this.monster.attack - this.character.defense;
                    if (damage > 0) {
                        this.character.hp -= damage;
                        this.elements.characterHP.textContent = 'HP: ' + this.character.hp;    
                    };
                } else if (random >= 51 ) {
                    combat.elements.announcement.textContent = 'Dodged!';
                    setTimeout(function() {combat.elements.announcement.textContent = "";}, 1000);
                }
            };
        } else if (combat.character.name === 'Touchstone') {
            combat.preFight = function() {
                combat.character.attack = randomNumber(1, 4);
                combat.character.defense = randomNumber(1, 4);
    
                combat.elements.announcement.textContent = 'Chaos Magic! Attack: ' + combat.character.attack + ' Defense: ' + combat.character.defense;
                setTimeout(function() {combat.elements.announcement.textContent = "";}, 1000);
    
                setTimeout(combat.fight(), 1000)
            }
        }
    },

    equipItem: function() {
        if (combat.item.name === 'Heavy Armor') {
    
            combat.character.defense = 3;
            combat.character.portrait = 'images/brutearmor.jpeg';
            combat.elements.characterImg.setAttribute('src', combat.character.portrait);

            this.elements.itemHeader.textContent = (this.item.name + ' equipped. +1 armor');

        } else if (combat.item.name === 'Second Weapon') {
            this.elements.itemHeader.textContent = (this.item.name) + ' equipped. You strike first!';

            combat.fight = function() {
                while (combat.character.hp > 0 && combat.monster.hp > 0) {
                    
                    this.characterAttack();
                    if (this.monster.hp <=0) {
                        // MONSTER DIES ANIMATION
                        this.character.gold += this.monster.gold;
                        combat.monstersDefeated++;
                        continue;
                    }
                    
                    this.monsterAttack();
                    
                    if (this.character.hp <= 0 ) {
                        // PLAYER DIES ANIMATION
    
                        setTimeout(function() {window.location.replace('bar.html')}, 1000);
                        continue;
                    };                
                };
    
                setTimeout(this.reset(), 1000);
            };
        } else if (combat.item.name === 'Backpack') {
            combat.fight = function() {
                this.elements.itemHeader.textContent = (this.item.name + ' equipped. Double gold!');

                while (combat.character.hp > 0 && combat.monster.hp > 0) {
        
                    combat.monsterAttack();
                    
                    if (combat.character.hp <= 0 ) {
                        // PLAYER DIES ANIMATION
                        setTimeout(function() {
                            window.location.replace('bar.html')
                        }, 1000);
                        continue;
                    }
                    
                    combat.characterAttack();
        
                    if (combat.monster.hp <=0) {
                        // MONSTER DIES ANIMATION
                        combat.character.gold += (combat.monster.gold * 2);
                    }
                }
                
                setTimeout(combat.reset(), 1000);
        
            };
        } else if (combat.item.name === 'Smoke Bomb') {    
            combat.item.use = function() {
                    combat.character.gold += (combat.monster.gold * 2);
                    combat.elements.announcement.textContent = 'Smoke Bomb used!';
                    combat.monstersDefeated++;
                    combat.elements.itemHeader.textContent = "";
                    
                    setTimeout(combat.reset(), 1000);
            }
        } else if (combat.item.name === 'Healing Potion') {
            combat.item.use = function () {
                if (combat.item.used === false) {
                    combat.item.used = true;
                    combat.elements.itemHeader.textContent = "";
                    
                    combat.character.hp = 10;
                    
                    combat.elements.announcement.textContent = 'Healing Potion used. Health fully restored!';
                    
                    combat.elements.characterHP.textContent = 'HP: ' + combat.character.hp;                
                };
            };
        };
    
    },

    renderGraphics: function () {
        this.elements.characterImg.setAttribute('src', this.character.portrait);
        this.elements.characterHP.textContent = 'HP: ' + this.character.hp;
        this.elements.characterGold.textContent = 'Gold: ' + this.character.gold;
        
        this.elements.itemHeader.textContent = this.item.name;

        this.elements.monsterImg.setAttribute('src', this.monster.portrait);
    },

    createMonster: function () {    
        let random;
        if (combat.monstersDefeated < 4) {
            random = randomNumber(1, 2);
        } else if (combat.monstersDefeated === 4 || combat.monstersDefeated === 5) {
            random = randomNumber(1, 3);
        } else if (combat.monstersDefeated >=6) {
            random = 3;
        }
        
        if (random === 1 ) {
            combat.monster = new SmallMonster;
        } else if (random === 2) {
            combat.monster = new MediumMonster;
        } else if (random === 3) {
            combat.monster = new LargeMonster;
        }
    },

    // preFight is used by certain character abilities. It is otherwise filler.
    preFight: function () {
        combat.elements.announcement.textContent = "";
        combat.fight();
    },

    fight: function() {
        while (combat.character.hp > 0 && combat.monster.hp > 0) {

            combat.monsterAttack();
            
            if (combat.character.hp <= 0 ) {
                // PLAYER DIES ANIMATION
                this.elements.fight.removeEventListener('click', this.preFight);
                this.elements.flee.removeEventListener('click', this.flee);
                this.elements.itemHeader.removeEventListener('click', this.useItem);
                combat.elements.announcement.textContent = 'YOU DIED';
                setTimeout(function() {
                    window.location.replace('bar.html')
                }, 2000);
                continue;
            }
            
            combat.characterAttack();

            if (combat.monster.hp <=0) {
                // MONSTER DIES ANIMATION
                combat.character.gold += combat.monster.gold;
                combat.monstersDefeated++;
            }
        }
        
        setTimeout(combat.reset(), 1000);

    },

    monsterAttack: function() {
        const damage = this.monster.attack - this.character.defense;
        if (damage > 0) {
            this.character.hp -= damage;
            this.elements.characterHP.textContent = 'HP: ' + this.character.hp;
        }
    },

    characterAttack: function() {
        this.monster.hp -= this.character.attack;
    },

    flee: function() {

        // CHARACTER TURNS AND RUNS, SCREEN FADES TO BLACK
        localStorage.setItem('score', JSON.stringify([prompt('What is your name?'), combat.character.name, combat.item.name, combat.character.gold]));
        
        setTimeout(function() {window.location.replace('leaderboard.html')}, 1000);
    
    },

    reset: function() {
        this.createMonster();
        this.renderGraphics();
    }
};

combat.start();