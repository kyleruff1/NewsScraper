
// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(document).ready(function() {

    $(".save-article").on("click", function(event) {
    
        var headline = $(event.target).attr('data-headline');
        var summary = $(event.target).attr('data-summary');
        var link = $(event.target).attr('data-link');
      
        console.log($(event.target).attr('data-headline'));
        console.log($(event.target).attr('data-summary'));
        console.log($(event.target).attr('data-link'));
    
        var savedArticle = {
          headline: headline,
          summary: summary,
          link: link
        };
    
        console.log("Saved Article", savedArticle)
        console.log("I am saving articles!")
    
       $.ajax({
          url: "/save",
          type: "POST",
          data: savedArticle
        }).then(
          function(savedArticle) {
            console.log("AJAX done sending saved article to mongoose");
            location.reload();
          });
      });
    
    
      $(".note").on("click", function(event) {
        var id = $(this).data("id");
    
        var newNote = {
          text: $(".text").val().trim(),
          title: $(".title").val().trim()
        };
    
        console.log("I am getting notes from articles! ", newNote)
    
        $.ajax({
          url: "/note",
          type: "POST",
          data: newNote
        }).then(
          function(note) {
            console.log("added note", newNote);
            location.reload();
          }
        );
      });
    
    
    
      $(".delete").on("click", function(event) {
        var id = $(this).data("id");
    
        $.ajax("/delete/" + id, {
          type: "DELETE",
        }).then(
          function() {
            console.log("deleted note", id);
            location.reload();
          }
        );
      });
    
    
    });
    
    