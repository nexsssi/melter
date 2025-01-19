document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('canvas');
    const draggableItems = document.querySelectorAll('.item-to-drop');
    
    let draggedItem = null;

    // Initialize draggable items
    draggableItems.forEach(item => {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    // Canvas drop zone setup
    canvas.addEventListener('dragover', handleDragOver);
    canvas.addEventListener('drop', handleDrop);

    function handleDragStart(e) {
        draggedItem = this;
        this.classList.add('dragging');
        e.dataTransfer.setData('text/plain', this.dataset.flowyType);
    }

    function handleDragEnd(e) {
        draggedItem = null;
        this.classList.remove('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function handleDrop(e) {
        e.preventDefault();
        const type = e.dataTransfer.getData('text/plain');
        
        // Create new flowchart node
        const node = createFlowNode(type, e.clientX, e.clientY);
        canvas.appendChild(node);
    }

    function createFlowNode(type, x, y) {
        const node = document.createElement('div');
        node.className = 'flow-node absolute';
        
        // Position relative to canvas
        const rect = canvas.getBoundingClientRect();
        node.style.left = (x - rect.left) + 'px';
        node.style.top = (y - rect.top) + 'px';

        // Copy content from original item
        const original = document.querySelector(`[data-flowy-type="${type}"]`);
        node.innerHTML = original.innerHTML;
        
        return node;
    }
});