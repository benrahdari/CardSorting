
        function getRandomSubset(arr, k) {
            let subset = [];
            let tempArr = [...arr]; // Copy to avoid modifying the original array

            for (let i = 0; i < k; i++) {
                if (tempArr.length === 0) break; // Break if the array is empty

                let index = Math.floor(Math.random() * tempArr.length);
                subset.push(tempArr.splice(index, 1)[0]);
            }

            return subset;
        }
        function generateAllPairs(length, limit) {
            var final = [];
            const pairs = [];
            for (let i = 1; i <= length; i++) {
                for (let j = i + 1; j <= length; j++) {
                    pairs.push([i, j]);
                }
            }

            if (limit > 0) {
                final = getRandomSubset(pairs, limit);
            }else{
                final = pairs
            }
            return final;
        }

        function selectAndRemove(options) {
            if (options.length < 2) {
                return -1;
            }
            const index = Math.floor(Math.random() * options.length);
            const option = options.splice(index, 1)[0];

            var base_url = $('#base_url').val();
            $('#option_1').attr("src", base_url + option[0] + ".png");
            $('#option_2').attr("src", base_url + option[1] + ".png");


            return option;
        }

        function UpdateButtonCount() {
            $('#trailCountBadge').text(trial_count > 100 ? '99+ rated' : trial_count + '/' + total_options + ' rated');
        }

        function logSelection() {
            const timestamp = new Date();
            const duration = (timestamp - selectionStartTime) / 1000;  // Duration in seconds

            // Create a unique key for each log entry (e.g., using the timestamp)
            const logKey = `selection_${timestamp.getTime()}`;

            // Add the log entry to the global log
            selectionLog[logKey] = {
                options: option,
                selected: selected,
                comment: $('#comment').val(),
                timestamp: timestamp.toISOString(),
                duration: duration,
                eventData: eventData
            };

            // Reset the selection start time for the next selection
            selectionStartTime = new Date();
        }

        function exit_to_survey() {
            $('#main').fadeOut(300);
            $('#survey').fadeIn(300);

        }

        //session

        is_real_study = 0 //Change this to 1 for a real study

        let date = new Date();
        let timestamp = date.getTime();
        user_id = timestamp.toString() + "_" + Math.random().toString(36).substr(2, 4);

        console.log("Assigning a new ID to the user: " + user_id);

        trial_count = 0;
        selected = -1;
        selectionLog = {};
        selectionStartTime = new Date();  // To track the start time of selection
        globalStartTime = new Date();
        counter = 0;
        remaining_options = 0;
        comment = "";
        demographics = [-1, -1, -1];
        eventData = [];


        //Creating a list of all available options

        //select how many pairs should be generated
        length = 12;
        console.log("creating a list of options.");
        options = generateAllPairs(length,5);
        remaining_options = options.length;
        total_options = options.length;
        console.log("options are: " + options.length);

        //initializing the first trial
        option = selectAndRemove(options);

        $(document).ready(function () {

            $(window).on('load', function () {
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                    window.location.href = "http://184.169.193.223/mobile";
                }
            });

            console.log("Document is ready!");

            $('#modal_intro').modal({
                backdrop: 'static',
                keyboard: false
            });
            $('#modal_intro').modal('show');

            UpdateButtonCount();

            $('input[name="btnradio"]').on('change', function () {

                selected = option[$('input[name="btnradio"]:checked').val()];
                console.log(selected);
            });

        });

        $('#continue').click(function () {
            $('#intro').hide();
            $('#main').fadeIn(500);
        });
        $('#openpage').click(function () {
            $('#page').fadeIn(500);
        });

        $('#next').click(function () {

            if ($('input[name="btnradio"]:checked').length > 0) {
                logSelection();
                selectionStartTime = new Date();
                eventData = [];

                option = selectAndRemove(options);
                trial_count++;
                UpdateButtonCount();
                $('input[name="btnradio"]').prop('checked', false);


                remaining_options -= 1;

                if (trial_count == total_options) {
                    console.log("compeleted!");

                    exit_to_survey();
                }

                $("#save").prop("disabled", false); // Enable the button
                $('#comment').val("");

            } else {
                alert("Please select one option.");
            }
        });

        $('#skip').click(function () {
            selectAndRemove(options);
            remaining_options -= 1;
            total_options -= 1;
            UpdateButtonCount();
            $("#save").prop("disabled", false); // Enable the button
            $('#comment').val("");
        });

        function send_data() {

            // Confirm with the user
            const isConfirmed = confirm("Are you sure you want to continue?");
            if (isConfirmed) {

                // Convert log to JSON
                let finalLog = {
                    user_id: user_id,
                    start_time: globalStartTime.toISOString(),
                    selections: selectionLog,
                    end_time: new Date().toISOString(),
                    demographics: demographics,
                    email: $('#sub').val(),
                    logging_type: is_real_study
                };
                const logJson = JSON.stringify(finalLog);

                console.log(finalLog);
                // AJAX request to send data
                $.ajax({
                    url: 'http://184.169.193.223/compare',  // Replace with your server URL
                    type: 'POST',
                    contentType: 'application/json',
                    data: logJson,
                    success: function (response) {
                        // Handle success
                        console.log('Data sent successfully', response);
                        //exit
                        exit_to_survey();
                    },
                    error: function (xhr, status, error) {
                        // Handle error
                        console.error('Error sending data', error);
                    }
                });
            }

        }
        $('#save').click(function () {

            const isConfirmed = confirm("Are you sure you want to continue?");
            if (isConfirmed) {
                $('#main').fadeOut(300);
                $('#survey').fadeIn(300);
            }
        });

        $('#removeBlur').click(function () {
            $('.getstarted').css('filter', 'none');
            $("#removeBlur").fadeOut(300);
            $("#enlarge").fadeIn(300);

            // Update the button text immediately
            $("#continue").text("Continue (" + counter + " sec.)");

            var interval = setInterval(function () {
                counter--;
                $("#continue").text("Continue (" + counter + " sec.)");

                if (counter <= 0) {
                    clearInterval(interval);
                    $("#continue").text("Continue"); // Reset button text
                    $("#continue").prop("disabled", false); // Enable the button
                }
            }, 1000);
            globalStartTime = new Date();
        });

        $('#open_instruction').click(function () {
            $('#modal_intro').modal('show');
        });
        $(document).on('input', '#age', function () {
            demographics[0] = $(this).val();
        });

        $(document).on('input', '#education', function () {
            demographics[1] = $(this).val();
        });

        $(document).on('input', '#experties', function () {
            console.log($(this).val());
            demographics[2] = $(this).val();
        });

        function end_survey() {
            send_data();
            $('#survey_content').fadeOut(300);
            $('#save_survey').fadeOut(300);
            $('#skip_survey').fadeOut(300);
            $('#survey_desc').fadeOut(300);
            $("#final_message").fadeIn(300);
            $('#open_instruction').fadeOut(300);

        }
        $('#save_survey').click(function () {
            end_survey();
            console.log("All data was saved!");
        });

        $('#skip_survey').click(function () {
            end_survey();
            console.log("data was saved! survery was skiped!");
        });


//         // Randomly selects a subset from an array without altering the original array
// function getRandomSubset(arr, k) {
//     let subset = [];
//     let tempArr = [...arr]; // Make a shallow copy to prevent modification of the original array
//     while (k-- > 0 && tempArr.length > 0) {
//         let index = Math.floor(Math.random() * tempArr.length);
//         subset.push(tempArr.splice(index, 1)[0]);
//     }
//     return subset;
// }

// // Generates all unique pairs for a given length
// function generateAllPairs(length, limit) {
//     let pairs = [];
//     for (let i = 1; i <= length; i++) {
//         for (let j = i + 1; j <= length; j++) {
//             pairs.push([i, j]);
//         }
//     }
//     return limit > 0 ? getRandomSubset(pairs, limit) : pairs;
// }

// // Selects a random option from the list and updates the image sources
// function selectAndRemove(options) {
//     if (options.length < 2) return -1;
//     let index = Math.floor(Math.random() * options.length);
//     let [option1, option2] = options.splice(index, 1)[0];
//     $('#option_1').attr("src", $('#base_url').val() + option1 + ".png");
//     $('#option_2').attr("src", $('#base_url').val() + option2 + ".png");
//     return [option1, option2];
// }

// // Updates the counter for trials on the UI
// function updateButtonCount() {
//     $('#trailCountBadge').text(trial_count > 100 ? '99+ rated' : `${trial_count}/${total_options} rated`);
// }

// // Logs the selection data for each trial
// function logSelection() {
//     const timestamp = new Date();
//     const duration = (timestamp - selectionStartTime) / 1000;  // Duration in seconds
//     const logKey = `selection_${timestamp.getTime()}`;
//     selectionLog[logKey] = {
//         options: option,
//         selected: selected,
//         comment: $('#comment').val(),
//         timestamp: timestamp.toISOString(),
//         duration: duration,
//         eventData: eventData
//     };
//     selectionStartTime = new Date();
// }

// // Transition to survey phase
// function exitToSurvey() {
//     $('#main').fadeOut(300);
//     $('#survey').fadeIn(300);
// }

// // Define all global variables at the top of the script
// let trial_count = 0;
// let selected = -1;
// let selectionLog = {};
// let selectionStartTime = new Date(); // To track the start time of selection
// let globalStartTime = new Date();
// let counter = 0;
// let remaining_options = 0;
// let comment = "";
// let demographics = [-1, -1, -1];
// let eventData = [];
// let options = [];
// let total_options = 0;
// let option; // This will hold the current pair of options
// let is_real_study = 0; // Change this to 1 for a real study


// // Main jQuery document ready function
// $(document).ready(function () {
//     // Check for mobile devices and redirect
//     $(window).on('load', function () {
//         if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
//             window.location.href = "http://184.169.193.223/mobile";
//         }
//     });

//     $('#modal_intro').modal({
//         backdrop: 'static',
//         keyboard: false
//     }).modal('show');

//     updateButtonCount();

//     $('input[name="btnradio"]').change(function () {
//         selected = option[$('input[name="btnradio"]:checked').val()];
//     });

//     $('#continue').click(function () {
//         $('#intro').hide();
//         $('#main').fadeIn(500);
//     });

//     $('#next').click(function () {
//         if ($('input[name="btnradio"]:checked').length > 0) {
//             logSelection();
//             option = selectAndRemove(options);
//             trial_count++;
//             updateButtonCount();
//             $('input[name="btnradio"]').prop('checked', false);
//             if (trial_count === total_options) {
//                 exitToSurvey();
//             }
//             $('#save').prop("disabled", false);
//             $('#comment').val("");
//         } else {
//             alert("Please select one option.");
//         }
//     });

//     $('#skip').click(function () {
//         selectAndRemove(options);
//         remaining_options--;
//         total_options--;
//         updateButtonCount();
//         $('#save').prop("disabled", false);
//         $('#comment').val("");
//     });

//     $('#removeBlur').click(function () {
//         $('.getstarted').css('filter', 'none');
//         $("#removeBlur").fadeOut(300);
//         $("#enlarge").fadeIn(300);
//         var interval = setInterval(function () {
//             counter--;
//             $("#continue").text("Continue (" + counter + " sec.)");
//             if (counter <= 0) {
//                 clearInterval(interval);
//                 $("#continue").text("Continue");
//                 $("#continue").prop("disabled", false);
//             }
//         }, 1000);
//         globalStartTime = new Date();
//     });

//     $('#open_instruction').click(function () {
//         $('#modal_intro').modal('show');
//     });
// });

// // Function to send data at the end of the survey
// function sendSurveyData() {
//     if (!confirm("Are you sure you want to continue?")) return;
//     let finalLog = JSON.stringify({
//         user_id: user_id,
//         start_time: globalStartTime.toISOString(),
//         selections: selectionLog,
//         end_time: new Date().toISOString(),
//         demographics: demographics,
//         email: $('#sub').val(),
//         logging_type: is_real_study
//     });

//     $.ajax({
//         url: 'http://184.169.193.223/compare',
//         type: 'POST',
//         contentType: 'application/json',
//         data: finalLog,
//         success: response => console.log('Data sent successfully', response),
//         error: (xhr, status, error) => console.error('Error sending data', error)
//     });
// }

// $('#save_survey').click(function () {
//     sendSurveyData();
//     console.log("All data was saved!");
// });
