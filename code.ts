// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);
figma.ui.resize(690, 440);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = msg => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if(msg.type === 'load-font'){
    console.log("elleff")

    const heading_font = msg.heading_font;
    const body_font = msg.body_font;

    const loadHeading = async () => {
      console.log("loadiiiiing")
      await figma.loadFontAsync({ family: `${heading_font}`, style: "Regular" })
    }

    loadHeading().then(() => {
      const loadBody = async () => {
        await figma.loadFontAsync({ family: `${body_font}`, style: "Regular" })
      }
      loadBody().catch(() => {
        const notificationHandler = figma.notify("CHECK INTERNET CONNECTION", {
          timeout: 5000,
          error: true
        })
        return function (): void {
          notificationHandler.cancel()
        }
      })
    })
    loadHeading().catch(() => {
      const notificationHandler = figma.notify("FONT PAIR: FONT FAILED TO LOAD, CHECK INTERNET CONNECTION", {
        timeout: 5000,
        error: true
      })
      return function (): void {
        notificationHandler.cancel()
      }
    })
  }
  if(msg.type === 'create-frame'){
    const heading_font = msg.heading_font;
    const body_font = msg.body_font;
    const background_color = msg.background_color;
    const text_color = msg.text_color;
    const heading_content = msg.heading_content;
    const body_content = msg.body_content;

    const loadFonts = async () => {
      await figma.loadFontAsync({ family: `${heading_font}`, style: "Regular" })
      await figma.loadFontAsync({ family: `${body_font}`, style: "Regular" })
    }

    loadFonts().then(() => {
      makeFrame();
    })

    function makeFrame() {
      const nodes: SceneNode[] = [];

      const frame = figma.createFrame();
      const heading = figma.createText();
      const body = figma.createText();

      heading.fontName = ({ family: `${heading_font}`, style: "Regular" });
      body.fontName = ({ family: `${body_font}`, style: "Regular" });

      const heading_color = clone(heading.fills);
      heading_color[0].color.r = text_color[0]/255;
      heading_color[0].color.g = text_color[1]/255;
      heading_color[0].color.b = text_color[2]/255;
      heading.fills = heading_color

      const body_color = clone(body.fills);
      body_color[0].color.r = text_color[0]/255;
      body_color[0].color.g = text_color[1]/255;
      body_color[0].color.b = text_color[2]/255;
      body.fills = body_color;

      const frame_color = clone(frame.fills);
      frame_color[0].color.r = background_color[0]/255;
      frame_color[0].color.g = background_color[1]/255;
      frame_color[0].color.b = background_color[2]/255;
      frame.fills = frame_color;

      frame.layoutMode = "VERTICAL";
      frame.primaryAxisAlignItems = "MIN";
      frame.counterAxisAlignItems = "CENTER";

      frame.resize(400, 100);
      heading.resize(300, 10);
      body.resize(300, 10);

      heading.characters = `${heading_content}`;
      body.characters = `${body_content}`;

      heading.fontSize = 36;
      body.fontSize = 18;

      heading.strokeWeight = 700;
      body.strokeWeight = 400;

      body.textAutoResize = "HEIGHT";
      heading.textAutoResize = "HEIGHT";
      heading.textAlignVertical = "CENTER";
      body.textAlignVertical = "CENTER";

      frame.resize(400, heading.height + body.height);
      heading.resize(300, heading.height - 20);
      body.resize(300, body.height - 10);

      figma.currentPage.appendChild(frame);
      frame.appendChild(heading);
      frame.appendChild(body);
      nodes.push(frame, heading);

    }

    function clone(val) {
      const type = typeof val
      if (val === null) {
        return null
      } else if (type === 'undefined' || type === 'number' ||
                 type === 'string' || type === 'boolean') {
        return val
      } else if (type === 'object') {
        if (val instanceof Array) {
          return val.map(x => clone(x))
        } else if (val instanceof Uint8Array) {
          return new Uint8Array(val)
        } else {
          let o = {}
          for (const key in val) {
            o[key] = clone(val[key])
          }
          return o
        }
      }
      throw 'unknown'
    }
  }

  // Make sure to close the p lugin when you're done. Otherwise the plugin will
  // keep running, which s hows the cancel button at the bottom of the screen.
  // figma.closePlugin();
};
