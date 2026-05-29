/*
 * GreenRoots – Community Gardening Network
 * Main JavaScript (jQuery + Bootstrap)
 */

$(function () {

  /* ===========================
     1. AOS INIT
  =========================== */
  AOS.init({
    duration: 700,
    once: true,
    offset: 60,
    easing: 'ease-out-cubic'
  });


  /* ===========================
     2. NAVBAR SCROLL EFFECT
  =========================== */
  $(window).on('scroll.nav', function () {
    const scrollY = $(this).scrollTop();
    if (scrollY > 60) {
      $('#mainNav').addClass('scrolled');
    } else {
      $('#mainNav').removeClass('scrolled');
    }
    // Back-to-top visibility
    if (scrollY > 400) {
      $('#backToTop').fadeIn(300).css('display', 'flex');
    } else {
      $('#backToTop').fadeOut(300);
    }
    // Active nav link highlight
    updateActiveNav(scrollY);
  });

  // Smooth scroll for internal nav links
  $('a[href^="#"]').on('click', function (e) {
    const target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      const offsetTop = target.offset().top - 72;
      $('html, body').animate({ scrollTop: offsetTop }, 650, 'swing');
      // Close mobile menu
      $('#navMenu').collapse('hide');
    }
  });

  function updateActiveNav(scrollY) {
    const sections = ['#hero', '#about', '#community', '#seeds', '#tips', '#events', '#join', '#contact'];
    sections.forEach(function (id) {
      const el = $(id);
      if (!el.length) return;
      const top = el.offset().top - 80;
      const bottom = top + el.outerHeight();
      const link = $(`.nav-link[href="${id}"]`);
      if (scrollY >= top && scrollY < bottom) {
        $('.nav-link').removeClass('active');
        link.addClass('active');
      }
    });
  }


  /* ===========================
     3. COUNTER ANIMATION
  =========================== */
  let counterDone = false;

  $(window).on('scroll.counters', function () {
    if (counterDone) return;
    const heroBottom = $('#hero').offset().top + $('#hero').outerHeight();
    if ($(this).scrollTop() + $(window).height() >= heroBottom - 200) {
      counterDone = true;
      animateCounters();
    }
  });

  // Also trigger if hero already visible on load
  $(window).trigger('scroll.counters');

  function animateCounters() {
    $('.stat-num').each(function () {
      const $el = $(this);
      const target = parseInt($el.data('target'), 10);
      const duration = 1800;
      const stepTime = 16;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(function () {
        current += increment;
        if (current >= target) {
          $el.text(target.toLocaleString('en-IN'));
          clearInterval(timer);
        } else {
          $el.text(Math.floor(current).toLocaleString('en-IN'));
        }
      }, stepTime);
    });
  }


  /* ===========================
     4. BACK TO TOP
  =========================== */
  $('#backToTop').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 600);
  });


  /* ===========================
     5. TIPS FILTER
  =========================== */
  $('.btn-filter').on('click', function () {
    const $btn = $(this);
    const filter = $btn.data('filter');

    $('.btn-filter').removeClass('active');
    $btn.addClass('active');

    $('.tip-card-wrap').each(function () {
      const category = $(this).data('category');
      if (filter === 'all' || category === filter) {
        $(this).stop(true).fadeIn(300);
      } else {
        $(this).stop(true).fadeOut(200);
      }
    });
  });


  /* ===========================
     6. TIP MODAL
  =========================== */
  $('#tipModal').on('show.bs.modal', function (e) {
    const btn = $(e.relatedTarget);
    const title = btn.data('title');
    const body  = btn.data('body');
    $(this).find('#tipModalLabel').text(title);
    $(this).find('#tipModalBody').text(body);
  });


  /* ===========================
     7. CONNECT MODAL
  =========================== */
  $('#connectModal').on('show.bs.modal', function (e) {
    const btn = $(e.relatedTarget);
    const name = btn.data('name');
    $(this).find('#connectName').text(name);
    $(this).find('.modal-title').html('Connect with <span id="connectName">' + name + '</span>');
  });

  $('#sendConnectMsg').on('click', function () {
    const modal = bootstrap.Modal.getInstance(document.getElementById('connectModal'));
    modal.hide();
    showToast('✅ Message sent! They\'ll get back to you soon.');
  });


  /* ===========================
     8. EVENT MODAL
  =========================== */
  $('#eventModal').on('show.bs.modal', function (e) {
    const btn = $(e.relatedTarget);
    $(this).find('#eventModalLabel').text('Register – ' + btn.data('event'));
    $(this).find('#eventLocation').html(
      '<i class="bi bi-calendar-event-fill me-2"></i>' + btn.data('date') +
      ' &nbsp;|&nbsp; <i class="bi bi-geo-alt-fill me-1"></i>' + btn.data('loc')
    );
  });

  $('#confirmEventReg').on('click', function () {
    const form = document.getElementById('eventRegForm');
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }
    form.classList.remove('was-validated');
    const modal = bootstrap.Modal.getInstance(document.getElementById('eventModal'));
    modal.hide();
    showToast('🎉 You\'re registered! Check your email for details.');
    // reset
    $('#eventRegForm')[0].reset();
  });


  /* ===========================
     9. SEED LIBRARY SEARCH
  =========================== */
  $('#seedSearch').on('input', function () {
    const query = $(this).val().toLowerCase().trim();
    $('#seedList .seed-list-item').each(function () {
      const text = $(this).text().toLowerCase();
      if (!query || text.includes(query)) {
        $(this).slideDown(180);
      } else {
        $(this).slideUp(180);
      }
    });
  });

  // Clear search on modal close
  $('#seedModal').on('hidden.bs.modal', function () {
    $('#seedSearch').val('');
    $('#seedList .seed-list-item').show();
  });


  /* ===========================
     10. JOIN FORM VALIDATION
  =========================== */
  $('#joinForm').on('submit', function (e) {
    e.preventDefault();
    const form = this;
    if (!form.checkValidity()) {
      $(form).addClass('was-validated');
      return;
    }
    // Successful submit
    $(form).addClass('was-validated');
    const firstName = $('#firstName').val().trim();

    // Show confirmation in form
    $(form).parent().html(
      `<div class="text-center py-4">
        <div style="font-size:3.5rem;">🌿</div>
        <h4 class="mt-3 mb-2" style="font-family:'Playfair Display',serif;color:var(--green-deep);">Welcome to GreenRoots, ${firstName}!</h4>
        <p class="text-muted">Your free account is being set up. Check your email for a confirmation link.</p>
        <div class="mt-3">
          <span class="badge bg-success fs-6 px-4 py-2">🌱 Member Since 2026</span>
        </div>
      </div>`
    );

    showToast('🌱 Welcome to GreenRoots! Check your email, ' + firstName + '!');
  });


  /* ===========================
     11. NEWSLETTER FORM
  =========================== */
  $('#newsletterForm').on('submit', function (e) {
    e.preventDefault();
    const email = $('#newsletterEmail').val().trim();
    if (!email || !email.includes('@')) {
      $('#newsletterEmail').addClass('is-invalid');
      return;
    }
    $('#newsletterEmail').removeClass('is-invalid').val('');
    showToast('📧 Subscribed! Weekly tips coming your way.');
  });


  /* ===========================
     12. SEED ITEM HOVER PULSE
  =========================== */
  $(document).on('mouseenter', '.seed-item', function () {
    $(this).find('.seed-emoji').css('animation', 'pulse 0.4s ease');
  }).on('animationend', '.seed-item .seed-emoji', function () {
    $(this).css('animation', '');
  });


  /* ===========================
     13. HELPER: SHOW TOAST
  =========================== */
  function showToast(message) {
    const $toast = $('#successToast');
    $('#toastBody').text(message);
    const toastInstance = bootstrap.Toast.getOrCreateInstance($toast[0], {
      delay: 4000,
      autohide: true
    });
    toastInstance.show();
  }


  /* ===========================
     14. PARALLAX HERO
  =========================== */
  $(window).on('scroll.parallax', function () {
    const scrolled = $(this).scrollTop();
    $('body').css('--hero-parallax', scrolled * 0.4 + 'px');
  });


  /* ===========================
     15. FEATURE CARD TILT (subtle)
  =========================== */
  $('.feature-card').on('mousemove', function (e) {
    const card = $(this);
    const offset = card.offset();
    const cx = offset.left + card.outerWidth() / 2;
    const cy = offset.top + card.outerHeight() / 2;
    const dx = (e.pageX - cx) / (card.outerWidth() / 2);
    const dy = (e.pageY - cy) / (card.outerHeight() / 2);
    card.css('transform', `translateY(-6px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`);
  }).on('mouseleave', function () {
    $(this).css('transform', '');
  });

}); // end DOM ready
