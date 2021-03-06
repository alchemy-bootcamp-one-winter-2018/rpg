'use strict';

const combat = {
    characterSpecs: JSON.parse(localStorage.getItem('characterSpecs')),

    monster: new SmallMonster,

    monstersDefeated: 0,

    elements: {
        announcement: document.getElementById('announcement'),

        characterImg: document.getElementById('character-img'),
        characterHP: document.getElementById('character-hp'),
        characterGold: document.getElementById('character-gold'),
        charDamage: document.getElementById('character-damage'),
        goldIncrease: document.getElementById('gold-increase'),

        monsterImg: document.getElementById('monster-img'),
        
        fight: document.getElementById('fight'),
        flee: document.getElementById('flee'),
        itemHeader: document.getElementById('item')
    },

    start: function () {
        this.load();
        this.loadAbility();
        this.equipItem();

        this.elements.characterImg.setAttribute('src', this.character.portrait);

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
                    setTimeout(function() {combat.elements.announcement.textContent = "";}, 2000);
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

                        combat.elements.charDamage.textContent = '-' + damage;
                        combat.elements.charDamage.classList.add('damage');
            
                        setTimeout(function(){
                            combat.elements.charDamage.textContent = ("");
                            combat.elements.charDamage.classList.remove('damage');
                        },2000);
                    };
                } else if (random >= 51 ) {
                    const dodgey = new Audio("SoundFXShortened/roguedodge.mp3");
                    dodgey.play();
                    combat.elements.announcement.textContent = 'Dodged! No damage!';
                }
            };
        } else if (combat.character.name === 'Touchstone') {
            combat.preFight = function() {
                combat.character.defense = randomNumber(1, 4);
    
                combat.elements.announcement.textContent = 'Chaos Magic! Defense: ' + combat.character.defense;
                setTimeout(function() {combat.elements.announcement.textContent = "";}, 1500);
    
                combat.fight();
            }

            this.character.barrier = 20;

            this.monsterAttack = function() {
                const damage = combat.monster.attack - combat.character.defense;
                if (damage > 0) {
                    if (combat.character.barrier > 0) {
                        combat.character.barrier -= damage;
                        combat.elements.characterHP.textContent = 'HP: ' + combat.character.hp + '  Barrier: ' + combat.character.barrier;

                        combat.elements.charDamage.classList.add('barrier-damage');
                        combat.elements.charDamage.textContent = '-' + damage;
                        combat.elements.charDamage.classList.add('damage');
            
                        setTimeout(function(){
                            combat.elements.charDamage.textContent = ("");
                            combat.elements.charDamage.classList.remove('barrier-damage');
                            combat.elements.charDamage.classList.remove('damage');
                        },2000);
            
                    } else if (combat.character.barrier <= 0) {
                        combat.character.hp -= damage;
                        combat.elements.characterHP.textContent = 'HP: ' + combat.character.hp;

                        combat.elements.charDamage.textContent = '-' + damage;
                        combat.elements.charDamage.classList.add('damage');
            
                        setTimeout(function(){
                            combat.elements.charDamage.textContent = ("");
                            combat.elements.charDamage.classList.remove('damage');
                        },2000);
            
                    };
                };
            };

            this.renderGraphics = function () {
                this.elements.characterImg.setAttribute('src', this.character.portrait);

                if (combat.character.barrier > 0) {
                    this.elements.characterHP.textContent = 'HP: ' + this.character.hp + '  Barrier: ' + this.character.barrier;
                } else if (combat.character.barrier <= 0) {
                    this.elements.characterHP.textContent = 'HP: ' + this.character.hp;
                    
                }
                this.elements.characterGold.textContent = 'GOLD: ' + this.character.gold;
                
                this.elements.itemHeader.textContent = this.item.name;

                this.elements.monsterImg.setAttribute('src', this.monster.portrait);
            };        
        };
    },

    equipItem: function() {
        if (combat.item.name === 'Heavy Armor') {
    
            combat.character.defense = 3;

            this.elements.itemHeader.textContent = (this.item.name + ' equipped.');

        } else if (combat.item.name === 'Second Weapon') {
            this.elements.itemHeader.textContent = (this.item.name + ' equipped. First strike chance!');

            combat.fightFirst = function() {
                this.elements.announcement.textContent = "First strike! No damage taken!";
                const firstStrike = new Audio("SoundFXShortened/SecondWeaponSwing.mp3");
                firstStrike.play();

                while (combat.character.hp > 0 && combat.monster.hp > 0) {
                    
                    this.characterAttack();
                    if (this.monster.hp <=0) {
                        this.character.gold += this.monster.gold;
                        combat.monstersDefeated++;

                        combat.elements.monsterImg.classList.add('dying');
                        combat.elements.fight.removeEventListener('click', combat.preFight);             
                        combat.elements.fight.classList.toggle('pressed');
                        combat.elements.goldIncrease.textContent = "+" + combat.monster.gold;
                        combat.elements.goldIncrease.classList.toggle('bling');
        
                        setTimeout(function(){
                            combat.elements.monsterImg.classList.remove('dying');
                            combat.elements.fight.addEventListener('click', combat.preFight);
                            combat.elements.fight.classList.toggle('pressed');
                            combat.elements.goldIncrease.textContent = ("");
                            combat.elements.goldIncrease.classList.toggle('bling');
                        },2000);
        
                        continue;
                    }
                    
                    this.monsterAttack();
                    
                    if (this.character.hp <= 0 ) {
                        const splat = new Audio("SoundFXShortened/splat.mp3");
                        splat.play();
                        this.elements.fight.removeEventListener('click', this.preFight);
                        this.elements.flee.removeEventListener('click', this.flee);
                        this.elements.itemHeader.removeEventListener('click', this.useItem);
                        combat.elements.announcement.textContent = 'YOU DIED';
                        combat.elements.characterImg.classList.add('dying');
                        setTimeout(function() {window.location.replace('bar.html')}, 2000);
                        continue;
                    };                
                };
    
                this.reset();
            };

            combat.preFight = function() {
                combat.elements.announcement.textContent = "";
                const random = randomNumber (1,100);

                if (combat.character.hp <= 10) {
                    combat.character.hp += 1;
                    combat.elements.announcement.textContent = 'Healed 1hp';
                    setTimeout(function() {combat.elements.announcement.textContent = "";}, 2000);
                }

                if (random < 50) {
                    combat.fight();
                } else if (random >= 50) {
                    combat.fightFirst();
                }            
            };

        } else if (combat.item.name === 'Backpack') {
            this.elements.itemHeader.textContent = (this.item.name + ' equipped. Double gold!');

            combat.fight = function() {

                while (combat.character.hp > 0 && combat.monster.hp > 0) {
        
                    combat.monsterAttack();

                    if (combat.character.hp <= 0 ) {
                        this.elements.fight.removeEventListener('click', this.preFight);
                        this.elements.flee.removeEventListener('click', this.flee);
                        this.elements.itemHeader.removeEventListener('click', this.useItem);
                        const splat = new Audio("SoundFXShortened/splat.mp3");
                        splat.play();
                        combat.elements.announcement.textContent = 'YOU DIED';
                        combat.elements.characterImg.classList.add('dying');
                        setTimeout(function() {window.location.replace('bar.html')}, 2000);
                        continue;
                            }
                    
                    combat.characterAttack();
        
                    if (combat.monster.hp <=0) {
                        combat.character.gold += (combat.monster.gold * 2);
                        combat.monstersDefeated++;

                        combat.elements.monsterImg.classList.add('dying');
                        combat.elements.fight.removeEventListener('click', combat.preFight);             
                        combat.elements.fight.classList.toggle('pressed');
                        combat.elements.goldIncrease.textContent = "+" + combat.monster.gold;
                        combat.elements.goldIncrease.classList.toggle('bling');
        
                        setTimeout(function(){
                            combat.elements.monsterImg.classList.remove('dying');
                            combat.elements.fight.addEventListener('click', combat.preFight);
                            combat.elements.fight.classList.toggle('pressed');
                            combat.elements.goldIncrease.textContent = ("");
                            combat.elements.goldIncrease.classList.toggle('bling');
                        },2000);
        
                    }
                }

                setTimeout(function() {combat.reset();}, 2000);
        
            };
        } else if (combat.item.name === 'Smoke Bomb') {
            this.elements.itemHeader.textContent = this.item.name + '. Click to use.';
            this.elements.itemHeader.classList.add('useable-item');

            combat.item.use = function() {
                    if (combat.item.used === false) {
                        combat.item.used = true;

                        combat.character.gold += (combat.monster.gold);
                        const smoke = new Audio("SoundFXShortened/SmokeBomb.mp3");
                        smoke.play();
                        combat.elements.announcement.textContent = 'Smoke Bomb used! Automatic win!';
                        combat.monstersDefeated++;
                        combat.elements.itemHeader.textContent = "";

                        combat.elements.monsterImg.classList.add('dying');
                        combat.elements.fight.removeEventListener('click', combat.preFight);             
                        combat.elements.fight.classList.toggle('pressed');
                        combat.elements.goldIncrease.textContent = "+" + combat.monster.gold;
                        combat.elements.goldIncrease.classList.toggle('bling');
        
                        setTimeout(function(){
                            combat.elements.monsterImg.classList.remove('dying');
                            combat.elements.fight.addEventListener('click', combat.preFight);
                            combat.elements.fight.classList.toggle('pressed');
                            combat.elements.goldIncrease.textContent = ("");
                            combat.elements.goldIncrease.classList.toggle('bling');
                        },2000);
        
                    setTimeout(function(){combat.reset()}, 2000);
                }
            }
        } else if (combat.item.name === 'Healing Potion') {
            this.elements.itemHeader.textContent = this.item.name + '. Click to use.';
            this.elements.itemHeader.classList.add('useable-item');

            combat.item.use = function () {
                if (combat.item.used === false) {
                    combat.item.used = true;
                    combat.elements.itemHeader.textContent = "";
                    const healpot = new Audio("SoundFXShortened/chaosmagic.mp3");
                    healpot.play();

                    combat.character.hp = 10;

                    combat.elements.charDamage.classList.add('healing-potion');
                    combat.elements.charDamage.classList.add('healing');
                    combat.elements.charDamage.textContent = "+10";
    
                    setTimeout(function(){
                        combat.elements.charDamage.textContent = ("");
                        combat.elements.charDamage.classList.remove('healing');
                        combat.elements.charDamage.classList.remove('healing-potion');
                    },2000);
    
                    
                    combat.elements.announcement.textContent = 'Healing Potion used! Health fully restored!';

                    combat.elements.characterHP.textContent = 'HP: ' + combat.character.hp;
                }
            };
        };
    
    },

    renderGraphics: function () {
        this.elements.characterHP.textContent = 'HP: ' + this.character.hp;
        this.elements.characterGold.textContent = 'GOLD: ' + this.character.gold;
        
        this.elements.monsterImg.setAttribute('src', this.monster.portrait);
    },

    createMonster: function () {    
        let random;
        if (combat.monstersDefeated < 5) {
            random = randomNumber(1, 2);
        } else if (combat.monstersDefeated >= 5) {
            random = randomNumber(1, 3);
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
                this.elements.fight.removeEventListener('click', this.preFight);
                this.elements.flee.removeEventListener('click', this.flee);
                this.elements.itemHeader.removeEventListener('click', this.useItem);
                const splat = new Audio("SoundFXShortened/splat.mp3");
                splat.play();
                combat.elements.announcement.textContent = 'YOU DIED';
                combat.elements.characterImg.classList.add('dying');
                setTimeout(function() {window.location.replace('bar.html')}, 2000);
                continue;
            }

            combat.characterAttack();

            if (combat.monster.hp <=0) {
                combat.character.gold += combat.monster.gold;
                combat.monstersDefeated++;

                combat.elements.monsterImg.classList.add('dying');
                combat.elements.fight.removeEventListener('click', combat.preFight);             
                combat.elements.fight.classList.toggle('pressed');
                combat.elements.goldIncrease.textContent = "+" + combat.monster.gold;
                combat.elements.goldIncrease.classList.toggle('bling');

                setTimeout(function(){
                    combat.elements.monsterImg.classList.remove('dying');
                    combat.elements.fight.addEventListener('click', combat.preFight);
                    combat.elements.fight.classList.toggle('pressed');
                    combat.elements.goldIncrease.textContent = ("");
                    combat.elements.goldIncrease.classList.toggle('bling');
                },2000);
            }
        }

        setTimeout(function() {combat.reset();}, 2000);

    },

    monsterAttack: function() {
        const damage = this.monster.attack - this.character.defense;
        if (damage > 0) {
            this.character.hp -= damage;
            this.elements.characterHP.textContent = 'HP: ' + this.character.hp;

            combat.elements.charDamage.textContent = '-' + damage;
            combat.elements.charDamage.classList.add('damage');

            setTimeout(function(){
                combat.elements.charDamage.textContent = ("");
                combat.elements.charDamage.classList.remove('damage');
            },2000);
        }
    },

    characterAttack: function() {
        this.monster.hp -= this.character.attack;
    },

    flee: function() {

        const runawayMP = new Audio("SoundFXShortened/MontyPythonrunaway.mp3");
        runawayMP.play();

        localStorage.setItem('score', JSON.stringify([prompt('What is your name?'), combat.character.name, combat.item.name, combat.character.gold]));

        combat.elements.characterImg.classList.add('running-away');

        setTimeout(function() {window.location.replace('leaderboard.html')}, 2500);

    },

    reset: function() {
        this.createMonster();
        this.renderGraphics();
    }
};

combat.start();