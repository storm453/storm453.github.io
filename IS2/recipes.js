var items = {};

class Item extends HTMLElement
{
    static observedAttributes = ["name","icon"];
    constructor()
    {
        super();
        this.name = "";
        this.icon = document.createElement("img");
    }
    connectedCallback() {
    }
    attributeChangedCallback(name, oldValue,newValue)
    {
        console.log(`name: ${name} , newVal: ${newValue}`);
        if(name == "name")
        {
            items[newValue] = {icon:this.icon};
        }
        if(name == "icon")
        {
            this.icon.src = newValue;
        }
    }
}
customElements.define("mc-item",Item);

function addItem(name,icon_path)
{
    let icon = document.createElement("img");
    icon.src=icon_path;
    items[name] = {icon:icon};
}

class CraftingRecipe extends HTMLElement
{
    constructor()
    {
        super();
    }
    connectedCallback() {
        const shadow = this.attachShadow({mode:"open"});
        const container = document.createElement("div");

        const recTemplate = document.createElement("img");
        recTemplate.src = "reciptemplate.png";

        shadow.appendChild(container);
        container.appendChild(recTemplate);

        container.style.position = "relative";

        setTimeout(()=>{
            let ingredients = this.getElementsByTagName("ingredient");
            this.ingredients = {};
            for(let i of ingredients)
            {
                let item = items[i.innerHTML];
                if(item != undefined)
                {
                    this.ingredients[i.getAttribute("char")] = item
                }
            }
            let result = this.getElementsByTagName("result")[0];
            if(result != undefined)
            {
                let resultItem = items[result.innerHTML.trim()];
                this.quantity = result.getAttribute("quantity");
                if(!this.quantity && !isNaN(this.quantity))
                {
                    this.quantity = 1;
                }
                if(resultItem != undefined)
                {
                    this.result = resultItem;
                }
            }

            let patternElem = this.getElementsByTagName("pattern")[0]
            if(patternElem != undefined)
            {
                let pattern = (patternElem.innerHTML.trim()).split("\n");
                for(let lineNum = 0; lineNum < 3; lineNum++)
                {
                    if(pattern[lineNum] != undefined)
                    {
                        let line = pattern[lineNum];
                        let parsedLine = [];
                        for(let c of line.trim())
                        {
                            if(this.ingredients !=undefined)
                            {
                                if(this.ingredients[c] != undefined)
                                {
                                    parsedLine.push(this.ingredients[c])
                                }
                                else
                                {
                                    parsedLine.push(undefined);
                                }
                            }
                            pattern[lineNum] = parsedLine;
                        }
                    }
                }
                this.pattern = pattern

            }
            console.log(this.pattern )
            this.grid = [];
            for(let y = 0; y < 3; y++)
            {
                let line = [];
                for(let x = 0; x < 3; x++)
                {
                    let slot = document.createElement("div");
                    slot.style.position = "absolute"
                    slot.style.top = (16*(1+y))+"px";
                    slot.style.left = (16*(1+x))+"px";
                    line.push(slot);
                    if(this.pattern[y][x] != undefined)
                    {
                        slot.appendChild(this.pattern[y][x].icon.cloneNode());
                    }
                    container.appendChild(slot);
                }
                this.grid.push(line);
            }

            let slot = document.createElement("div");
            slot.style.position = "absolute";
            slot.style.top = 32+"px";
            slot.style.left = 96+"px";
            slot.appendChild(this.result.icon);
            container.appendChild(slot);
        });
    }
    
}
customElements.define("crafting-recipe",CraftingRecipe)