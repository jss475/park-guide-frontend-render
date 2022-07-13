import { Box, Text, Heading, Grid, GridItem, Image, OrderedList, List, ListItem, ListIcon } from '@chakra-ui/react'
import { useEffect } from 'react'
import '../yosemite.css'
import yosemite1 from '../yosemite6.jpg'
import '../yosemite_test.scss'
import {FaMountain} from 'react-icons/fa'

function Yosemite(){

    //credit to https://codepen.io/jackrugile/pen/nKKwQe for the waterfall animation and the css
    useEffect(()=> {

        
        var waterfallCanvas = function(c, cw, ch){
                    
                var _this = this;
                this.c = c;
                this.ctx = c.getContext('2d');
                this.cw = cw;
                this.ch = ch;			
                
                this.particles = [];
                this.particleRate = 6;
                this.gravity = .15;
                                

                this.init = function(){				
                    this.loop();
                };
                
                this.reset = function(){				
                    this.ctx.clearRect(0,0,this.cw,this.ch);
                    this.particles = [];
                };
                            
                this.rand = function(rMi, rMa){return ~~((Math.random()*(rMa-rMi+1))+rMi);};
                

                this.Particle = function(){
                    var newWidth = _this.rand(1,20);
                    var newHeight = _this.rand(1, 45);
                    this.x = _this.rand(10+(newWidth/2), _this.cw-10-(newWidth/2));
                    this.y = -newHeight;
                    this.vx = 0;
                    this.vy = 0;
                    this.width = newWidth;
                    this.height = newHeight;
                    this.hue = _this.rand(200, 220);
                    this.saturation = _this.rand(30, 60);
                    this.lightness = _this.rand(30, 60);
                };
                
                this.Particle.prototype.update = function(i){
                    this.vx += this.vx; 
                    this.vy += _this.gravity;
                    this.x += this.vx;
                    this.y += this.vy;							
                };
                
                this.Particle.prototype.render = function(){			
                    _this.ctx.strokeStyle = 'hsla('+this.hue+', '+this.saturation+'%, '+this.lightness+'%, .05)';
                    _this.ctx.beginPath();
                    _this.ctx.moveTo(this.x, this.y);
                    _this.ctx.lineTo(this.x, this.y + this.height);
                    _this.ctx.lineWidth = this.width/2;
                    _this.ctx.lineCap = 'round';
                    _this.ctx.stroke();
                };
                
                this.Particle.prototype.renderBubble = function(){				
                    _this.ctx.fillStyle = 'hsla('+this.hue+', 40%, 40%, 1)';
                    _this.ctx.fillStyle = 'hsla('+this.hue+', '+this.saturation+'%, '+this.lightness+'%, .3)';
                    _this.ctx.beginPath();
                    _this.ctx.arc(this.x+this.width/2, _this.ch-20-_this.rand(0,10), _this.rand(1,8), 0, Math.PI*2, false);
                    _this.ctx.fill();
                };
                            
                this.createParticles = function(){
                    var i = this.particleRate;
                    while(i--){
                        this.particles.push(new this.Particle());
                    }
                };
                
                this.removeParticles = function(){
                    var i = this.particleRate;
                    while(i--){
                        var p = this.particles[i];
                        if(p.y > _this.ch-20-p.height){
                            p.renderBubble();
                            _this.particles.splice(i, 1);
                        }	
                    }
                };
                                
                this.updateParticles = function(){					
                    var i = this.particles.length;						
                    while(i--){
                        var p = this.particles[i];
                        p.update(i);											
                    };						
                };
                
                this.renderParticles = function(){
                    var i = this.particles.length;						
                    while(i--){
                        var p = this.particles[i];
                        p.render();											
                    };					
                };
                
                this.clearCanvas = function(){				
                    this.ctx.globalCompositeOperation = 'destination-out';
                    this.ctx.fillStyle = 'rgba(255,255,255,.06)';
                    this.ctx.fillRect(0,0,this.cw,this.ch);
                    this.ctx.globalCompositeOperation = 'lighter';
                };
                
                this.loop = function(){
                    var loopIt = function(){					
                        requestAnimationFrame(loopIt, _this.c);					
                            _this.clearCanvas();					
                            _this.createParticles();					
                            _this.updateParticles();					
                            _this.renderParticles();	
                            _this.removeParticles();
                    };
                    loopIt();					
                };
            
            };
            
        var isCanvasSupported = function(){
            var elem = document.createElement('canvas');
            return !!(elem.getContext && elem.getContext('2d'));
        };

        var setupRAF = function(){
            var lastTime = 0;
            var vendors = ['ms', 'moz', 'webkit', 'o'];
            for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x){
                window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
                window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
            };
            
            if(!window.requestAnimationFrame){
                window.requestAnimationFrame = function(callback, element){
                    var currTime = new Date().getTime();
                    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                    var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
                    lastTime = currTime + timeToCall;
                    return id;
                };
            };
            
            if (!window.cancelAnimationFrame){
                window.cancelAnimationFrame = function(id){
                    clearTimeout(id);
                };
            };
        };			

        if(isCanvasSupported()){
                var c = document.getElementById('waterfall');
                var cw = c.width = 100;
                var ch = c.height = 140;	
                var waterfall = new waterfallCanvas(c, cw, ch);			  
                setupRAF();
                waterfall.init();
        }
    },[])

    return (
        <Box>
            <div className="yosemite-title-container">
                <Text fontSize="5xl" className="yosemite-title">Yosemite National Park</Text>
                <div className="bird-container bird-container--one">
                    <div className="bird bird--one"></div>
                </div>
                
                <div className="bird-container bird-container--two">
                    <div className="bird bird--two"></div>
                </div>
                
                <div className="bird-container bird-container--three">
                    <div className="bird bird--three"></div>
                </div>
                
                <div className="bird-container bird-container--four">
                    <div className="bird bird--four"></div>
                </div>
            </div>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}  p="40px" className="yosemite-about">
                <GridItem mt="auto" mb="auto">                
                    <Text className="yosemite-text" p="10px">
                    Yosemite National Park is an American national park in California, surrounded on the southeast by Sierra National Forest and on the northwest by Stanislaus National Forest. The park is managed by the National Park Service and covers an area of 759,620 acres (1,187 sq mi; 3,074 km^2) and sits in four counties - centered in Tuolumne and Mariposa, extending north and east to Mono and south to Madera County. Designated a World Heritage Site in 1984, Yosemite is internationally recognized for its granite cliffs, waterfalls, clear streams, giant sequoia groves, lakes, mountains, meadows, glaciers, and biological diversity. Almost 95 percent of the park is designated wilderness. Yosemite is one of the largest and least fragmented habitat blocks in the Sierra Nevada, and the park supports a diversity of plants and animals.
                    </Text>
                </GridItem>
                <GridItem>
                    <Image src={yosemite1} alt="Yosemite" className="yosemite-image"/>
                </GridItem>
            </Grid>

            <Text fontFamily="Raleway" fontSize="4xl" textAlign="center" mt="100px">Fun Facts about Yosemite</Text>           
            <List  ml="auto" mr="auto" mt="15px">
                <Box className="yosemite-list-container"> 
                    <ListItem className="fun-fact-item" w="60%" ml="auto" mr="auto">
                        <ListIcon as={FaMountain} color="green.500" />
                        Yosemite might be our nation's 3rd national park, but it sparked the idea of national parks. Twenty-six years before it was a national park, President Lincoln signed the Yosemite Land Grant on June 30, 1864, protecting the Mariposa Grove and Yosemite Valley. It was the first time the government protected land because of its natural beauty so that people could enjoy it, and we're still benefiting from their foresight today. Thanks to John Muir's passionate writing to further protect the delicate ecosystem of the High Sierra, Yosemite later became a national park.
                    </ListItem>
                </Box>
                <ListItem mt="10px" className="fun-fact-item" w="60%" ml="auto" mr="auto">
                    <ListIcon as={FaMountain} color="green.500" />
                    Yosemite's granite rock formations glow like fire at sunset. Sunlight plays amazing tricks at Yosemite -- illuminating El Capitan and Half Dome in brilliant reds and oranges. Horsetail Fall is famous for appearing to be on fire when it reflects the orange glow of sunset in mid- to late-February. It's a spectacular sight reminiscent of Yosemite's historic Firefall, which occurred nightly until 1968, when hotel operators would push campfire embers over Glacier Point to wow park goers.
                </ListItem>
                <Box className="yosemite-list-container"> 
                    <ListItem mt="10px" className="fun-fact-item" w="60%" ml="auto" mr="auto">
                        <ListIcon as={FaMountain} color="green.500" />
                        The park's diverse landscape supports more than 400 species. While at Yosemite, look all around and you might spy one of the park's many amphibians, reptiles, birds and mammals looking back. One such animal is the rare Sierra Nevada red fox, which was spotted for the first time in nearly 100 years on a wildlife cam, roaming the high elevations of California's Sierra Nevada.
                    </ListItem>
                </Box>
                <ListItem mt="10px" className="fun-fact-item" w="60%" ml="auto" mr="auto">
                    <ListIcon as={FaMountain} color="green.500" />
                    Yosemite is home to one of the tallest waterfalls in the world. At 2,425 feet, Yosemite Falls is one of tallest on the planet, but did you know, it's actually made up of three separate falls? Upper Yosemite Fall, the middle cascades and Lower Yosemite Fall makeup Yosemite Falls, which can be seen from numerous places around Yosemite Valley.
                </ListItem>
            </List>
            <div id="waterfall-container">
                <canvas id="waterfall"></canvas>
            </div>



        </Box>
    )

}

export default Yosemite