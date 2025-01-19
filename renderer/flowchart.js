document.addEventListener("DOMContentLoaded", function() {
    // Initialize variables
    let rightcard = false;
    let tempblock;
    let tempblock2;

    // Initialize the flowchart canvas
    const canvas = document.getElementById("canvas");
    
    // Add drag functionality to flowchart items
    const flowchartItems = document.querySelectorAll('.item-to-drop');
    flowchartItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    // Add drop zone functionality to the canvas
    canvas.addEventListener('dragover', handleDragOver);
    canvas.addEventListener('drop', handleDrop);

    function handleDragStart(e) {
        e.target.classList.add("dragging");
        tempblock2 = e.target;
        e.dataTransfer.setData('text/plain', e.target.getAttribute('data-flowy-type'));
    }

    function handleDragEnd(e) {
        e.target.classList.remove("dragging");
        if (tempblock2) {
            tempblock2.classList.remove("blockdisabled");
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function handleDrop(e) {
        e.preventDefault();
        const type = e.dataTransfer.getData('text/plain');
        
        // Create new block element
        const block = createBlock(type, e.clientX - canvas.getBoundingClientRect().left, 
                                      e.clientY - canvas.getBoundingClientRect().top);
        
        canvas.appendChild(block);
        
        // Make the dropped block draggable within the canvas
        makeBlockDraggable(block);
    }

    function createBlock(type, x, y) {
        const block = document.createElement('div');
        block.className = 'flowchart-block';
        block.style.position = 'absolute';
        block.style.left = `${x}px`;
        block.style.top = `${y}px`;
        
        // Add block content based on type
        const content = getBlockContent(type);
        block.innerHTML = content;
        
        return block;
    }

        function getBlockContent(type) {
        const templates = {
            'new-visitor': `
                <div class="block-content">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256">
                        <path d="M136,108A52,52,0,1,1,84,56,52,52,0,0,1,136,108Z" opacity="0.2"></path>
                        <path d="M117.25,157.92a60,60,0,1,0-66.5,0A95.83,95.83,0,0,0,3.53,195.63a8,8,0,1,0,13.4,8.74,80,80,0,0,1,134.14,0,8,8,0,0,0,13.4-8.74A95.83,95.83,0,0,0,117.25,157.92Z"></path>
                    </svg>
                    <span>New Visitor</span>
                </div>`,
            'time-delay': `
                <div class="block-content">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256">
                        <path d="M128,56A72,72,0,1,0,200,128,72.08,72.08,0,0,0,128,56Zm0,120a48,48,0,1,1,48-48A48.05,48.05,0,0,1,128,176Z" opacity="0.2"></path>
                        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path>
                    </svg>
                    <span>Time Delay</span>
                </div>`,
            'condition': `
                <div class="block-content">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256">
                        <path d="M128,24,24,128l104,104L232,128Z" opacity="0.2"></path>
                        <path d="M235.33,116.72,139.31,20.71a16,16,0,0,0-22.63,0L20.69,116.72a16,16,0,0,0,0,22.56l95.94,96a16,16,0,0,0,22.64,0l96.06-96a16,16,0,0,0,0-22.56ZM128,216,32,120,128,24l96,96Z"></path>
                    </svg>
                    <span>Condition</span>
                </div>`,
            'email': `
                <div class="block-content">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256">
                        <path d="M224,56l-96,88L32,56Z" opacity="0.2"></path>
                        <path d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-8,144H40V74.19l82.59,75.71a8,8,0,0,0,10.82,0L216,74.19V192Z"></path>
                    </svg>
                    <span>Email</span>
                </div>`,
            'action': `
                <div class="block-content">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256">
                        <path d="M216,48V208a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8H208A8,8,0,0,1,216,48Z" opacity="0.2"></path>
                        <path d="M208,32H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32Zm0,176H48V48H208V208Zm-48-32a8,8,0,0,1-8,8H104a8,8,0,0,1,0-16h48A8,8,0,0,1,160,176Zm32-48a8,8,0,0,1-8,8H72a8,8,0,0,1,0-16H184A8,8,0,0,1,192,128Zm0-48a8,8,0,0,1-8,8H72a8,8,0,0,1,0-16H184A8,8,0,0,1,192,80Z"></path>
                    </svg>
                    <span>Action</span>
                </div>`,
            'exit': `
                <div class="block-content">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256">
                        <path d="M216,48V208a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V48a8,8,0,0,1,8-8H208A8,8,0,0,1,216,48Z" opacity="0.2"></path>
                        <path d="M112,216a8,8,0,0,1-8,8H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32h56a8,8,0,0,1,0,16H48V208h56A8,8,0,0,1,112,216Zm109.66-93.66-40-40a8,8,0,0,0-11.32,11.32L196.69,120H104a8,8,0,0,0,0,16h92.69l-26.35,26.34a8,8,0,0,0,11.32,11.32l40-40A8,8,0,0,0,221.66,122.34Z"></path>
                    </svg>
                    <span>Exit</span>
                </div>`
        };
        
        return templates[type] || '';
    }

    function makeBlockDraggable(block) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;

        block.addEventListener('mousedown', startDragging);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDragging);

        function startDragging(e) {
            initialX = e.clientX - block.offsetLeft;
            initialY = e.clientY - block.offsetTop;
            isDragging = true;
        }

        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                
                // Keep block within canvas bounds
                currentX = Math.max(0, Math.min(currentX, canvas.offsetWidth - block.offsetWidth));
                currentY = Math.max(0, Math.min(currentY, canvas.offsetHeight - block.offsetHeight));
                
                block.style.left = `${currentX}px`;
                block.style.top = `${currentY}px`;
            }
        }

        function stopDragging() {
            isDragging = false;
        }
    }
});
