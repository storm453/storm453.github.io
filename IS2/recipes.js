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

function addItem(name,icon_path,link=true)
{
    let icon = document.createElement("img");
    icon.src=icon_path;
    items[name] = {icon:icon, name:name, link:link};
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
                        var exists = false;
                        var block = false;
    
                        if(this.pattern[y][x] != undefined)
                        {
                            exists = true;
    
                            if(this.pattern[y][x].icon.src.includes("block"))
                            {
                                block = true;
                            }
                        }
    
                        let slot = document.createElement("div");
                        slot.style.position = "absolute"
                        slot.style.top = ((22)+ (y*18))+"px";
                        slot.style.left = ((20)+(x*18))+"px";
    
                        if(block)
                        {
                            this.pattern[y][x].icon.width = 16;
                            this.pattern[y][x].icon.height = 16;
                        }
    
                        line.push(slot);
    
                        if(exists)
                        {
                            let link = document.createElement("a");
                            if(this.pattern[y][x].link == true) link.href = this.pattern[y][x].name+".html";
                            link.appendChild(this.pattern[y][x].icon.cloneNode());
                            slot.appendChild(link);
                        }
                        container.appendChild(slot);
                    }
                    this.grid.push(line);
                }
    
                var exists = false;
                var block = false;
    
                if(this.result != undefined)
                {
                    exists = true;
                    
                    if(this.result.icon.src.includes("block"))
                    {
                        block = true;
                    }
                }
    
                let slot = document.createElement("div");
                
                slot.style.position = "absolute";
                slot.style.top = 40+"px";
                slot.style.left = 98+"px";
    
                if(block)
                {
                    this.result.icon.width = 16;
                    this.result.icon.height = 16;
                }
    
                if(exists)
                {
                    let link = document.createElement("a");
                    if(this.result.link == true) link.href = this.result.name+".html";
                    link.appendChild(this.result.icon.cloneNode());
                    slot.appendChild(link);
                }
                container.appendChild(slot);
        });
    }
    
}
customElements.define("crafting-recipe",CraftingRecipe)
