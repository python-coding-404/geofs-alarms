// ==UserScript==
// @name         GeoFS-Alarms
// @namespace    https://github.com/fengshuo2004/geofs-alarms
// @version      0.1.2
// @description  Adds cockpit alarm sounds to GeoFS online flight simulator
// @author       PEK-97
// @match        https://www.geo-fs.com/geofs.php*

// ==/UserScript==


    var stickShake = new Audio("https://github.com/fengshuo2004/geofs-alarms/raw/master/stall.ogg");
    stickShake.type = "audio/ogg";
    stickShake.loop = true;
    var overspeedClacker = new Audio("https://github.com/fengshuo2004/geofs-alarms/raw/master/overspeed.ogg");
    overspeedClacker.type = "audio/ogg";
    overspeedClacker.loop = true;
    // wait until flight sim is fully loaded
    let itv = setInterval(
        function(){
            if(unsafeWindow.ui && unsafeWindow.flight){
                main();
                clearInterval(itv);
            }
        }
    ,500);

    async function main(){
        // monkey-patch the stall.setVisibility method
        let prevStalled = false;
        unsafeWindow.ui.hud.stall.setVisOld = unsafeWindow.ui.hud.stall.setVisibility;
        unsafeWindow.ui.hud.stall.setVisibility = function (a) {
            if (a) {
                 try {
                 stickShake.play();
                 } catch {
                     console.log("oh no")
                 }
            } else if (prevStalled) {
                stickShake.pause();
            }
            prevStalled = a;
            this.setVisOld(a);
        }
        // monkey-patch the setAnimationValue method
        let prevOversped = false;
        unsafeWindow.flight.setAniValOld = unsafeWindow.flight.setAnimationValues;
        unsafeWindow.flight.setAnimationValues = function(a) {
            this.setAniValOld(a);
            let hasOversped = unsafeWindow.geofs.animation.values.kias >= 350;
            if (hasOversped && !prevOversped){
                 overspeedClacker.play();
            } else if (!hasOversped && prevOversped){
                overspeedClacker.pause();
            }
            prevOversped = hasOversped;
        }
    }
